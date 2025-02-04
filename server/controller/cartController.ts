import Cart, { ICart, ICartItem } from '../models/cartModel'; // Assuming models are typed
import { Document } from 'mongoose';

class CartController {
    async getCart(userId: string) {
        return Cart.findOne({ userId });
        // return Cart.findOne({ userId })
        //     .populate({
        //         path: 'items.itemId',
        //         match: { isActive: true } // Filter the items by isActive field
        //     });
    }

    async getAll() {
        return Cart.find();
    }

    async addItemToCart(cartId: string, data: ICartItem) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            let isAlreadyAdded = false;
            cart.items.forEach(item => {
                if (item.itemId.toString() === data.itemId.toString()) {
                    item.qty += data.qty;
                    isAlreadyAdded = true;
                }
            });

            if (!isAlreadyAdded) {
                cart.items.push(data);
            }

            return await cart.save();
        } catch (err) {
            return err;
        }
    }

    async save(cart: ICart) {
        console.log(cart);
        return new Cart(cart).save();
    }

    async deleteItem(cartId: string, itemId: string) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            cart.items = cart.items.filter(item => item.itemId.toString() !== itemId.toString());

            return await cart.save();
        } catch (err) {
            return err;
        }
    }

    async updateCartItems(cartId: string, items: ICartItem[]) {
        return Cart.findByIdAndUpdate(
            cartId,
            { $set: { items } },
            { new: true }
        );
    }

    async clearCart(userId: string) {
        return Cart.updateOne(
            { userId },
            { $set: { items: [] } }
        );
    }

    async removeItemFromAllCarts(itemId: string) {
        const carts = await Cart.find();
        return Promise.all(carts.map(cart => this.deleteItem(cart._id.toString(), itemId)));
    }
}

export default new CartController();
