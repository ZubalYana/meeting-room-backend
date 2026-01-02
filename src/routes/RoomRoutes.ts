import express from "express";
import Room from "../schemas/Room";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, capacity, location, description, advantages } = req.body;
        if (!name || !capacity || !location) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const newRoom = new Room({ name, capacity, location, description, advantages });
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
