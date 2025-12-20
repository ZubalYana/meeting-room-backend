import { Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}