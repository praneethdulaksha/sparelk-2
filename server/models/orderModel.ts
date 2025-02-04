import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    itemId: mongoose.Types.ObjectId;
    qty: number;
    status: string;
    review: object | null;
    total: number;
    orderDate: string;
    receivedDate: string | null;
}

const orderSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending',
    },
    review: {
        type: Object,
        default: null,
    },
    total: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: String,
        required: true,
    },
    receivedDate: {
        type: String,
        default: null,
    },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
