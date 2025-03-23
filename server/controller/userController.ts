import User, { IUser } from '../models/userModel';
import Cart from '../controller/cartController';
import Store from '../controller/storeController';
import { getJwtToken } from '../util/utilMatters';
import { sendMail } from '../config/emailConfig';
import mongoose from "mongoose";
import cartModel from '../models/cartModel';

class UserController {
    async getAll(): Promise<IUser[]> {
        return User.find();
    }

    async register(user: IUser): Promise<{ user: IUser; cart: any; store: any }> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            user.verifyCode = `sparelk${user.firstName}${Date.now()}${user.lastName}`;
            // Save User
            const newUser = await new User(user).save({ session });
            const cart = await new cartModel({ userId: newUser._id, items: [] }).save({ session });
            const store = null;

            // Email Verification
            const verificationLink = `http://localhost:5173/user-verify/${user.verifyCode}`;
            const emailHtml = `
                <h1>Welcome to Spare.lk!</h1>
                <p>Click the link below to verify your email and activate your account:</p>
                <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;border-radius:5px;text-decoration:none;">Verify Email</a>
                <p>If you didn't request this, please ignore this email.</p>
            `;

            await sendMail({
                to: user.email,
                subject: "Spare.lk - Email Verification",
                html: emailHtml,
            });

            // Commit Transaction if everything is successful
            await session.commitTransaction();
            session.endSession();

            return { user: newUser, cart, store };
        } catch (err) {
            // Rollback transaction if any error occurs
            await session.abortTransaction();
            session.endSession();
            console.error("Error during registration:", err);
            throw new Error("Registration failed. Please try again.");
        }
    }

    async verify(verifyCode: string) {
        // search by verifycode
        const user = await User.findOne({ verifyCode });
        if (!user) throw new Error('User not found');
        await sendMail({
            to: user.email,
            subject: "Spare.lk - Email Verification",
            html: `
            <h1>Spare.lk - Email Verification</h1>
            <p>Your email verification has been successful. You can now login to your account.</p>
        `,
        });
        await User.findByIdAndUpdate(user._id, { verified: true });
    }

    async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, { $set: user }, { new: true });
    }

    async delete(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }

    async login(username: string, password: string) {
        try {
            const user = await User.findOne({ email: username, password: password });
            if (user) {
                if (!user.verified) throw new Error('User not verified')
                const cart = await Cart.getCart(user._id);
                const store = await Store.getStoreByUser(user._id);

                const accessToken = getJwtToken(user, '3h');
                const refreshToken = getJwtToken(user, '72h');
                await sendMail({
                    to: user.email,
                    subject: "Logged in to SpareLK",
                    text: `Logged in to SpareLK at ${new Date().toLocaleString()}`,
                })
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
