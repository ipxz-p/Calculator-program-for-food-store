import mongoose, { Schema, Model } from "mongoose";
import type { IMenuItem } from "./types";

export type { IMenuItem } from "./types";

const MenuItemSchema = new Schema<IMenuItem>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    hasDoubleOrderDiscount: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MenuItemModel: Model<IMenuItem> =
  mongoose.models.MenuItem || mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
