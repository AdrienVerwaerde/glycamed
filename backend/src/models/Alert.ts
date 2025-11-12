import mongoose, { Document, Schema } from "mongoose";

// TypeScript enum for alert types
export enum AlertType {
  CAFFEINE = "caffeine",
  CALORIES = "calories",
  SUGAR = "sugar",
  BOTH = "both",
}

// TypeScript interface for the Alert document
export interface IAlert extends Document {
  type: AlertType;
  date: Date; 
  caffeineAmount: number; 
  sugarAmount: number; 
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
        message: "{VALUE} is not a valid alert type",
      },
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    caffeineAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    sugarAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index unique pour éviter les doublons (une alerte par jour)
AlertSchema.index({ date: 1 }, { unique: true });

export default mongoose.model<IAlert>("Alert", AlertSchema);
