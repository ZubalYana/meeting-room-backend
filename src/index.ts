import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

mongoose.connect(process.env.MONGO_URI ?? '')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    })

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({ message: "TypeScript + Express server here" });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT} (env: ${process.env.NODE_ENV ?? "dev"})`);
});