import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";

//Routes imports
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productsRoutes";
import consumptionRoutes from "./routes/consumptionRoutes";
import alertRoutes from "./routes/alertRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", productRoutes);
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Glycamed API",
    version: "1.0.0",
  });
});

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
