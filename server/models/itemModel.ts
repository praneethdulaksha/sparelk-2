import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
    rating: number;
    discount?: number;
    image: string;
    category: string;
    isActive: boolean;
    store: mongoose.Types.ObjectId;
    sold: number;
}

const itemSchema = new Schema<IItem>({
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
    category: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    sold: { type: Number, required: true, default: 0 }
});

export default mongoose.model<IItem>("Item", itemSchema);
