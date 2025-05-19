export type TItem = {
  _id: string;
  code: string;
  name: string;
  price: number;
  discount: number;
  description: string;
  image: string;
  images360?: string[];
  rating: number;
  category: string;
  vehicleModel: string;
  brand: string;
  condition: ECondition;
  sold: number;
  stock: number;
  isActive: boolean;
  store: {
    _id: string;
    store: string;
    name: string;
  };
};

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

export enum ECondition {
  NEW = "New",
  USED = "Used",
  ALL = "All",
}

export interface TUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: EUserRole;
  phone?: string;
  verified: boolean;
  authCode: number;
  authCodeExpiration: number;
  address?: TAddress | null;
  creditCard?: TCreditCard | null;
  createdAt?: Date;
  updatedAt?: Date;
  store?: any;
  cart?: any;
}

export interface TStore {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  image: string;
  userId: string;
}

export enum EUserRole {
  SELLER = "seller",
  BUYER = "buyer",
  ADMIN = "admin",
}

export interface TOrder {
  _id?: string;
  userId: string;
  itemId: string;
  qty: number;
  status: string;
  total: number;
  orderDate: string;
  receivedDate: string | null;
  review: {
    user: string;
    rate: number;
    comment: string;
    date: string;
    sellerFeedback: any;
  } | null;
}

export interface TReview {
  _id: string;
  user: string;
  rate: number;
  comment: string;
  date: string;
  sellerFeedback: any;
}
