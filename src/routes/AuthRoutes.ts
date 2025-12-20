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

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1d' });

        res.status(200).json({ token: token });
    }
    catch (err) {
        console.log('Error logging user in:', err);
        res.status(500).json({ message: 'Server error' });
    }
})

export default router;