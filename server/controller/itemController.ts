import Item, { IItem } from '../models/itemModel';
import Cart from '../controller/cartController';
import deleteImage from '../util/utilMatters';
import itemModel from '../models/itemModel';

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
        // search item by code
        const existingItem = await Item.findOne({ code: body.code });
        if (existingItem) throw new Error('Item with this code already exists');
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

    async filterItems({ price, condition, categories, brands, keyword, sort, count }: any) {

        try {
            let filter: any = {};

            // Keyword Search
            if (keyword) {
                filter.$or = [
                    { name: { $regex: keyword, $options: "i" } },
                    { vehicleModel: { $regex: keyword, $options: "i" } },
                    { code: { $regex: keyword, $options: "i" } }
                ];
            }

            // Category Filter
            if (categories) {
                filter.category = { $in: categories.split(",") };
            }

            // Brands Filter
            if (brands) {
                filter.brand = { $in: brands.split(",") };
            }

            // Price Filter
            if (price) {
                filter.price = { $gte: 0, $lte: price || Infinity };
            }

            // Condition Filter
            if (condition && condition !== "All") {
                filter.condition = condition;
            }

            // Count Filter for pagination
            const skip = (count.page - 1) * count.limit;

            // Sorting
            let sortOption: any = {};
            if (sort === "new") sortOption.createdAt = 1;
            if (sort === "low") sortOption.price = 1;
            if (sort === "high") sortOption.price = -1;
            if (sort === "popular") sortOption.name = -1;

            // Fetch Filtered Products
            const filteredItems = await Item.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(count.limit)
            const totalCount = await Item.countDocuments(filter);
            if (totalCount < count.to) count.to = totalCount;

            console.log("Filtered Items:", filter);

            return {
                count: { tot: totalCount },
                items: filteredItems
            };
        } catch (error) {
            console.error("Error filtering products:", error);
            throw error;
        }
    }
}

export default new ItemModel();
