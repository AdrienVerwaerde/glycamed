import mongoose, { Document, Schema } from "mongoose";

export interface IConsumption extends Document {
  product: string;
  productImage?: string;
  quantity: number;
  location: string;
  userId: string;
  caffeine: number;
  sugar: number;
  calories: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsumptionSchema = new Schema<IConsumption>(
  {
    product: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    productImage: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0.01, "Quantity must be greater than 0"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User", // Reference to User model
    },
    caffeine: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Caffeine cannot be negative"],
    },
    sugar: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Sugar cannot be negative"],
    },
    calories: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Calories cannot be negative"],
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Index for faster queries
ConsumptionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IConsumption>("Consumption", ConsumptionSchema);
