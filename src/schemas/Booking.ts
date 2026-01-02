import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    attendees: { type: Array, default: [] },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
