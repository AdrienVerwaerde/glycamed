import mongoose, { Document, Schema } from "mongoose";

export interface IConsumption extends Document {
  product: string;
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

const ConsumptionSchema = new Schema<IConsumption>({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  userId: { type: String, required: true },
  caffeine: { type: Number, required: true },
  sugar: { type: Number, required: true },
  calories: { type: Number, required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IConsumption>("Consumption", ConsumptionSchema);
