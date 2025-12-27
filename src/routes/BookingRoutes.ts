import express from "express";
import Booking from "../schemas/Booking";
import Room from "../schemas/Room";
import jwt from "jsonwebtoken";

const router = express.Router();

const auth = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded: any = jwt.verify(token, "secret");
        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

router.get("/:roomId", auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ room: req.params.roomId })
            .populate("user", "email")
            .populate("room", "name");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", auth, async (req: any, res: any) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "email")
            .populate("room", "name");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", auth, async (req: any, res: any) => {
    try {
        const { roomId, date, startTime, endTime } = req.body;

        if (!roomId || !date || !startTime || !endTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await Booking.findOne({ room: roomId, date, startTime });
        if (existing) return res.status(400).json({ message: "Time slot already booked" });

        const booking = new Booking({
            room: roomId,
            user: req.userId,
            date,
            startTime,
            endTime
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
