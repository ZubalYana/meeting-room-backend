import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
    name: string;
    capacity: number;
    location: string;
    description?: string;
}

const RoomSchema: Schema = new Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String },
});

export default mongoose.model<IRoom>("Room", RoomSchema);
