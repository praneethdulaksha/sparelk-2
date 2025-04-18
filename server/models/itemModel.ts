import mongoose, { Schema, Document } from 'mongoose';

export enum ECondition {
    NEW = 'New',
    USED = 'Used',
    ALL = 'All',
}

export interface IItem extends Document {
    code: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    rating: number;
    discount?: number;
    image: string;
    brand: string;
    vehicleModel: string;
    category: string;
    condition: ECondition;
    isActive: boolean;
    store: mongoose.Types.ObjectId;
    sold: number;
    createdAt?: number;
}

const itemSchema = new Schema<IItem>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: {
        type: String,
        required: true,
        default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque porta mi tincidunt diam malesuada, eu porta nunc cursus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque mauris mi, elementum dapibus gravida quis, vestibulum a neque. Integer faucibus ligula nisl, vel consequat urna lobortis vitae. Vivamus venenatis eros eu tincidunt feugiat. Donec congue, arcu eu viverra feugiat, lacus augue suscipit eros, in tincidunt lectus nulla quis dolor. Nulla hendrerit nisi nec felis egestas luctus. Pellentesque interdum imperdiet erat vitae venenatis. Integer imperdiet feugiat magna ac posuere. Aenean leo diam, porta vel scelerisque a, ultricies eget nunc. In hac habitasse platea dictumst. Nulla facilisi.'
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    rating: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, enum: Object.values(ECondition), default: ECondition.NEW },
    isActive: { type: Boolean, required: true, default: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    sold: { type: Number, required: true, default: 0 },
    createdAt: { type: Number, default: Date.now() },
});

export default mongoose.model<IItem>("Item", itemSchema);
