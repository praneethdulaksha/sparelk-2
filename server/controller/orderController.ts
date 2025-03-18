import mongoose, { ClientSession } from 'mongoose';
import Order, { IOrder } from '../models/orderModel';
import Cart from '../controller/cartController';
import Item from '../models/itemModel';

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
    async saveOrder(cartOrItem: string, order: OrderRequest): Promise<IOrder[]> {
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
            const data = await Promise.all(ordersToSave.map(orderData => new Order(orderData).save()));
            await session.commitTransaction();
            return data;
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
}

export default new OrderItemController();
