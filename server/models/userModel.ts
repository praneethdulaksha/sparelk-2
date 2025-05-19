import mongoose, { Schema, Document } from "mongoose";

export interface IAddress {
  no: string;
  street: string;
  city: string;
}

export interface ICreditCard {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export enum ERole {
  BUYER = "buyer",
  SELLER = "seller",
  ADMIN = "admin",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ERole;
  verified: boolean;
  verifyCode: string;
  authCode: number;
  authCodeExpiration: number;
  phone?: string;
  address?: IAddress | null;
  creditCard?: ICreditCard | null;
}

const UserSchema: Schema = new Schema<IUser>({
<<<<<<< HEAD
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ERole, default: ERole.BUYER },
  phone: { type: String, required: false },
  verified: { type: Boolean, default: false },
  verifyCode: { type: String, required: false },
  authCode: { type: Number, required: false, default: -1 },
  authCodeExpiration: { type: Number, required: false, default: -1 },
  address: {
    type: new Schema({
      no: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
    }),
    required: false,
    default: null,
  },
  creditCard: {
    type: new Schema({
      number: { type: String, required: true },
      expiryMonth: { type: String, required: true },
      expiryYear: { type: String, required: true },
      cvv: { type: String, required: true },
    }),
    required: false,
    default: null,
  },
=======
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ERole, default: ERole.BUYER },
    phone: { type: String, required: false },
    verified: { type: Boolean, default: false },
    verifyCode: { type: String, required: false},
    authCode: { type: Number, required: false, default: -1 },
    authCodeExpiration: { type: Number, required: false, default: -1 },
    address: {
        type: new Schema({
            no: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true }
        }),
        required: false,
        default: null
    },
    creditCard: {
        type: new Schema({
            number: { type: String, required: true },
            expiryMonth: { type: String, required: true },
            expiryYear: { type: String, required: true },
            cvv: { type: String, required: true }
        }),
        required: false,
        default: null
    }
>>>>>>> 5ec3dfa601f50fc9ee750dd7b37bb6557d013672
});

export default mongoose.model<IUser>("User", UserSchema);
