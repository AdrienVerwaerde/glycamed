import { Schema, model, Document } from "mongoose";

export interface Nutriments {
  sugars_100g?: number;
  caffeine_100g?: number;
  energy_kcal_100g?: number;
}

export interface ProductDocument extends Document {
  code: string; // barcode
  name: string;
  brand?: string;
  imageUrl?: string;
  servingSize?: string;
  nutriments: Nutriments;
  categories?: string[];
  lastFetchedAt: Date;
}

const NutrimentsSchema = new Schema<Nutriments>({
  sugars_100g: Number,
  caffeine_100g: Number,
  energy_kcal_100g: Number,
}, { _id: false });

const ProductSchema = new Schema<ProductDocument>({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  brand: String,
  imageUrl: String,
  servingSize: String,
  nutriments: { type: NutrimentsSchema, default: {} },
  categories: [String],
  lastFetchedAt: { type: Date, default: () => new Date() },
}, { timestamps: true });

export const ProductModel = model<ProductDocument>("Product", ProductSchema);
