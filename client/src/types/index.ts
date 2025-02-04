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

export interface TAddress {
    no: string;
    street: string;
    city: string;
}

export interface TCreditCard {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

export interface TUser {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    address?: TAddress | null;
    creditCard?: TCreditCard | null;
    createdAt?: Date;
    updatedAt?: Date;
    store?: any;
    cart?: any;
}

export interface TStore {
    _id: string,
    name: string,
    address: string,
    email: string,
    phone: string,
    image: string,
    userId: string,
}