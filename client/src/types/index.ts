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
    _id: "661a3f15cf8939470178430b",
    name: "TechLK",
    address: "12/B, Lake Road, Colombo",
    email: "tgdilshanrangaka2002@gmail.com",
    phone: "+94771234567",
    image: "1712996117960-abstract-blue-extruded-voronoi-b.jpg",
    userId: "661a3e95cf893947017842fc",
}