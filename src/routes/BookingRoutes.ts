import express from "express";
import Booking from "../schemas/Booking";
import Room from "../schemas/Room";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
const router = express.Router();
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDING_EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

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
        const { roomId, date, startTime, endTime, attendees } = req.body;

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
            endTime,
            attendees: attendees
        });

        await booking.save();

        if (attendees && attendees.length > 0) {
            const roomDetails = await Room.findById(roomId);
            const roomName = roomDetails ? roomDetails.name : "Meeting Room";

            const mailOptions = {
                from: '"Office Booker" <your-email@gmail.com>',
                to: attendees,
                subject: `Meeting Invitation: ${roomName}`,
                html: `
                    <h3>You have been invited to a meeting</h3>
                    <p><strong>Room:</strong> ${roomName}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
                    <br/>
                    <p>Please mark your calendar.</p>
                `
            };

            transporter.sendMail(mailOptions).catch(err => console.error("Email failed:", err));
        }

        res.status(201).json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
