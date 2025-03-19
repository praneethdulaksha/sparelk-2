import User, { IUser } from '../models/userModel';
import Cart from '../controller/cartController';
import Store from '../controller/storeController';
import { getJwtToken } from '../util/utilMatters';

class UserController {
    async getAll(): Promise<IUser[]> {
        return User.find();
    }

    async register(user: IUser): Promise<{ user: IUser; cart: any; store: any }> {
        try {
            const data = await new User(user).save();
            const cart = await Cart.save({ userId: data._id, items: [] } as any);
            const store = null; // Assuming store is null when registering a user
            return { user: data, cart: cart, store: store };
        } catch (err) {
            throw err;
        }
    }

    async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, { $set: user }, { new: true });
    }

    async delete(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }

    async login(username: string, password: string) {
        try {
            const user = await User.findOne({ email: username, password: password });
            if (user) {
                const cart = await Cart.getCart(user._id);
                const store = await Store.getStoreByUser(user._id);

                const accessToken = getJwtToken(user, '3h');
                const refreshToken = getJwtToken(user, '72h');
                return { user, cart, store, accessToken, refreshToken };
            } else {
                throw new Error('User not found');
            }
        } catch (err) {
            throw err;
        }
    }
}

export default new UserController();
