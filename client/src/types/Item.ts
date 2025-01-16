export type TItem = {
    _id: string;
    name: string;
    price: number;
    discount: number;
    description: string;
    image: string;
    rating: number;
    category: string;
    sold: number;
    stock: number;
    store: {
        _id: string;
        store: string;
        name: string;
    }
}