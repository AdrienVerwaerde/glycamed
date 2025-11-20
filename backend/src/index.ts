import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";

//Routes imports
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productsRoutes";
import consumptionRoutes from "./routes/consumptionRoutes";
import alertRoutes from "./routes/alertRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(
    cors({
        origin: ["http://localhost:3000", "http://frontend:3000"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Glycamed API",
        version: "1.0.0",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/consumptions", consumptionRoutes);
app.use("/api/alerts", alertRoutes);

// Error handler (should be last)
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
    .connect(MONGO_URI as string)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });
