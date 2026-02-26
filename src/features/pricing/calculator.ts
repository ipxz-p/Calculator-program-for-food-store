import { CartItem } from "@/features/cart/types";
import { DiscountStrategy, MenuItemPriceInfo, PriceBreakdown } from "./types";
import {
  createDoubleOrderDiscount,
  createMemberDiscount,
} from "./strategies";
import { createDiscountPipeline } from "./pipeline";

export function createPriceCalculator(
  menuItems: Map<string, MenuItemPriceInfo>,
  strategies?: DiscountStrategy[]
) {
  const pipeline = createDiscountPipeline(
    strategies ?? [
      createDoubleOrderDiscount(menuItems),
      createMemberDiscount(),
    ]
  );

  function calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => {
      const menuItem = menuItems.get(item.menuItemId);
      if (!menuItem) return sum;
      return sum + menuItem.price * item.quantity;
    }, 0);
  }

  function calculate(items: CartItem[], isMember: boolean): PriceBreakdown {
    const subtotal = calculateSubtotal(items);
    const result = pipeline(items, isMember, subtotal);

    return {
      subtotal,
      discounts: result.discounts,
      total: Math.round(result.runningTotal * 100) / 100,
    };
  }

  return { calculateSubtotal, calculate };
}
