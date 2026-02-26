import { z } from "zod";
import { CartItem } from "@/features/cart/types";

export interface DiscountEntry {
  kind: string;
  name: string;
  amount: number;
}

export interface PipelineContext {
  items: CartItem[];
  isMember: boolean;
  subtotal: number;
  runningTotal: number;
  discounts: DiscountEntry[];
}

export interface DiscountStrategy {
  kind: string;
  name: string;
  isApplicable(ctx: PipelineContext): boolean;
  calculate(ctx: PipelineContext): number;
}

export interface MenuItemPriceInfo {
  price: number;
  hasDoubleOrderDiscount: boolean;
}

export interface PriceBreakdown {
  subtotal: number;
  discounts: DiscountEntry[];
  total: number;
}

export const calculatePriceRequestSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
  isMember: z.boolean(),
});

export type CalculatePriceRequest = z.infer<typeof calculatePriceRequestSchema>;

export type CalculatePriceResponse = PriceBreakdown;
