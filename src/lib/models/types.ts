import type { Document } from "mongoose";

export interface IMenuItem extends Document {
  slug: string;
  name: string;
  price: number;
  description: string;
  hasDoubleOrderDiscount: boolean;
  createdAt: Date;
  updatedAt: Date;
}
