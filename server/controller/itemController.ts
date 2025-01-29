import Item, { IItem } from '../models/itemModel';
import Cart from '../controller/cartController';
import deleteImage from '../util/utilMatters';

class ItemModel {
    async getAll(): Promise<IItem[]> {
        return Item.find({ isActive: true, stock: { $gte: 1 } });
    }

    async getItem(id: string): Promise<IItem | null> {
        return Item.findById(id).populate('store', 'name');
    }

    async getDiscounts(): Promise<IItem[]> {
        return Item.find({ discount: { $gte: 20 }, stock: { $gte: 1 }, isActive: true });
    }

    async getByCategory(category: string): Promise<IItem[]> {
        return Item.find({ category: category, stock: { $gte: 1 }, isActive: true });
    }

    async getStoreItems(storeId: string): Promise<IItem[]> {
        return Item.find({ store: storeId });
    }

    async getByName(keyword: string): Promise<IItem[]> {
        return Item.find({ name: { $regex: keyword, $options: 'i' } });
    }

    async save(body: any, imageFile: Express.Multer.File): Promise<any> {
        const itemData = { ...body, image: imageFile.filename };
        return await new Item(itemData).save();
    }

    async update(itemId: string, body: any, imageFile?: Express.Multer.File): Promise<any> {
        const prevItem = await Item.findById(itemId);
        if (!prevItem) throw new Error('Item not found');

        let updatedBody = imageFile ? { ...body, image: imageFile.filename } : { ...body, image: prevItem.image };
        const updatedItem = await Item.findByIdAndUpdate(itemId, updatedBody, { new: true });

        if (imageFile) {
            deleteImage(prevItem.image);
        }

        return updatedItem;
    }

    async inactiveItemsByStoreId(storeId: string): Promise<any> {
        return Item.updateMany({ store: storeId }, { $set: { isActive: false } });
    }

    async setItemActive(itemId: string): Promise<any> {
        const data = await Item.findById(itemId);
        if (!data) throw new Error('Item not found');

        return Item.updateOne({ _id: itemId }, { $set: { isActive: !data.isActive } });
    }

    async setItemsActiveAll(): Promise<any> {
        return Item.updateMany({ isActive: false }, { $set: { isActive: true } });
    }

    async delete(itemId: string): Promise<any> {
        const cartUpdate = await Cart.removeItemFromAllCarts(itemId);
        if (!cartUpdate) throw new Error('Failed to remove item from carts');

        const item = await Item.findById(itemId);
        if (!item) throw new Error('Item not found');

        deleteImage(item.image);
        return Item.findByIdAndDelete(itemId);
    }
}

export default new ItemModel();
