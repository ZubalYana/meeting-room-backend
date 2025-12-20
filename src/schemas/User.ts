import mongoose, { Schema } from "mongoose";
import { IUser } from "../models/User";

const userSchema: Schema<IUser> = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true, default: "user" },
    },
    { timestamps: true }
)

export default mongoose.model<IUser>("User", userSchema);