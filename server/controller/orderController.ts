import mongoose, { ClientSession } from 'mongoose';
import Order, { IOrder } from '../models/orderModel';
import Cart from '../controller/cartController';
import Item from '../models/itemModel';
import { sendMail } from '../config/emailConfig';
import userModel from '../models/userModel';

interface OrderItem {
    itemId: string;
    qty: number;
    total: number;
}

interface Review {
    rate: number;
}

interface OrderRequest {
    userId: string;
    orderItems: OrderItem[];
}

class OrderItemController {
    async saveOrder(cartOrItem: string, order: OrderRequest) {
        const user = await userModel.findById(order.userId);
        if (!user) throw new Error("User not found");
        const ordersToSave: any[] = order.orderItems.map(oItem => ({
            userId: order.userId,
            itemId: oItem.itemId,
            qty: oItem.qty,
            total: oItem.total,
            orderDate: new Date().toLocaleString(),
            receivedDate: null,
            review: null
        }));

        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();
        try {
            if (cartOrItem === 'cart') await Cart.clearCart(order.userId);
            const data = await Promise.all(
                ordersToSave.map(async (orderData) => {
                    // reduce item stock quantity
                    await Item.findByIdAndUpdate(orderData.itemId, { $inc: { stock: -orderData.qty } })
                        .then(() => new Order(orderData).save({ session }))
                        .catch(() => { throw new Error('Not enough stock to place order') })
                })
            );
            await session.commitTransaction();
            // Send email with order details
            const emailHtml = `
                <h2>Thank you for your order at SpareLK!</h2>
                <p>Your order has been successfully placed. Below are your order details:</p>
                <ul>
                    ${ordersToSave.map(oItem => `
                        <li>Item ID: ${oItem.itemId}, Quantity: ${oItem.qty}, Total: $${oItem.total}</li>
                    `).join('')}
                </ul>
                <p>We will notify you once your order is processed.</p>
            `;

            await sendMail({
                to: user.email,
                subject: "SpareLK - Order Confirmation",
                html: emailHtml
            });
        } catch (err) {
            await session.abortTransaction();
            console.error(err);
            throw err;
        } finally {
            session.endSession();
        }
    }

    async updateOrder(order: IOrder): Promise<IOrder | null> {
        if (order.status === 'Received') {
            await Item.findByIdAndUpdate(order.itemId, { $inc: { sold: order.qty, stock: -order.qty } });
        }
        return Order.findByIdAndUpdate(order._id, { $set: order }, { new: true });
    }

    async saveReview(order: IOrder): Promise<IOrder | null> {
        const orders: IOrder[] = await Order.find({ itemId: order.itemId });
        orders.push(order);

        const ratings = [0, 0, 0, 0, 0];
        let totRatingsCount = 0;
        let totRatings = 0;

        orders.forEach(o => {
            if (o.review) {
                ratings[(o.review as Review).rate - 1]++;
                totRatingsCount++;
            }
        });

        ratings.forEach((r, i) => {
            totRatings += r * (i + 1);
        });

        const itemRating = parseFloat((totRatings / totRatingsCount).toFixed(1)) || 0;

        console.log('ratings', ratings);
        console.log('totRatings', totRatings);
        console.log('totRatingsCount', totRatingsCount);
        console.log('---', itemRating);

        await Item.findByIdAndUpdate(order.itemId, { $set: { rating: itemRating } });
        return Order.findByIdAndUpdate(order._id, { $set: order }, { new: true });
    }

    async getOrders(userId: string): Promise<IOrder[]> {
        return Order.find({ userId });
    }

    async getReviewsByItemId(itemId: string): Promise<Review[]> {
        try {
            const orders = await Order.find({ itemId });
            return orders.map(order => order.review).filter(review => review !== null) as Review[];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async addSellerFeedback(reviewId: string, feedback: any) {
        try {
            const result = await Order.findOneAndUpdate(
                { "review._id": new mongoose.Types.ObjectId(reviewId) },
                { $set: { "review.sellerFeedback": feedback } },
                { new: true }
            );

            console.log("result", result, feedback);

            if (!result) {
                throw new Error("Review not found");
            }
        } catch (err) {
            console.error("Error adding seller feedback:", err);
            throw err;
        }
    }
}

export default new OrderItemController();
