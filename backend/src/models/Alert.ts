import mongoose, { Document, Schema } from "mongoose";

// TypeScript enum for alert types
export enum AlertType {
  CAFFEINE = "caffeine",
  CALORIES = "calories",
  SUGAR = "sugar",
}

// TypeScript interface for the Alert document
export interface IAlert extends Document {
  type: AlertType;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const AlertSchema = new Schema<IAlert>(
  {
    type: {
      type: String,
      required: [true, "Alert type is required"],
      enum: {
        values: Object.values(AlertType),
        message:
          "{VALUE} is not a valid alert type. Must be: caffeine, calories, or sugar",
      },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export default mongoose.model<IAlert>("Alert", AlertSchema);
