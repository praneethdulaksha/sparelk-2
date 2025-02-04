import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
    name: string;
    address: string;
    email: string;
    phone: string;
    image: string;
    userId: mongoose.Types.ObjectId;
}

const storeSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: 'images/store.png',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Store = mongoose.model<IStore>('Store', storeSchema);

export default Store;
