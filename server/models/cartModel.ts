import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
    itemId: mongoose.Schema.Types.ObjectId;
    qty: number;
}

export interface ICart extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    items: ICartItem[];
}

const CartSchema = new Schema<ICart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            itemId: {
                type: Schema.Types.ObjectId,
                ref: "Item",
                required: true,
            },
            qty: {
                type: Number,
                required: true,
            },
        },
    ],
});

export default mongoose.model<ICart>("Cart", CartSchema);
