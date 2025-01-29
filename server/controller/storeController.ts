import Store, { IStore } from '../models/storeModel';
import Item from '../controller/itemController';
import deleteImage from '../util/utilMatters';

class StoreController {
    
    async getAll(): Promise<IStore[]> {
        return Store.find();
    }

    async getByStoreId(storeId: string): Promise<IStore | null> {
        return Store.findById(storeId);
    }

    async getStoreByUser(userId: string): Promise<IStore | null> {
        return Store.findOne({ userId });
    }

    async save(body: Partial<IStore>, imageFile: Express.Multer.File): Promise<IStore> {
        const storeData = { ...body, image: imageFile.filename };
        return new Store(storeData).save();
    }

    async update(id: string, body: Partial<IStore>, imageFile?: Express.Multer.File): Promise<IStore | null> {
        const prevStore = await Store.findById(id);
        if (!prevStore) throw new Error("Store not found");

        const updatedData = imageFile ? { ...body, image: imageFile.filename } : { ...body, image: prevStore.image };
        const updatedStore = await Store.findByIdAndUpdate(id, updatedData, { new: true });

        if (imageFile) {
            await deleteImage(prevStore.image);
        }

        return updatedStore;
    }

    async delete(id: string): Promise<IStore | null> {
        const store = await Store.findById(id);
        if (!store) throw new Error("Store not found");

        // Delete store image
        await deleteImage(store.image);

        // Delete all items in the store
        const items = await Item.getStoreItems(id);
        for (const item of items) {
            await Item.delete(item._id);
        }

        return Store.findByIdAndDelete(id);
    }
}

export default new StoreController();