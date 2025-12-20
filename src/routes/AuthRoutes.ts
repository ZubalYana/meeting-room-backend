import User from "../schemas/User";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email: email,
            password: hashedPassword,
            role: "user"
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        console.log('Error registering user:', err);
        res.status(500).json({ message: 'Server error' });
    }
})

export default router;