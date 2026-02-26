import { DiscountStrategy, MenuItemPriceInfo } from "../types";

const PAIR_SIZE = 2;
const DISCOUNT_RATE = 0.05;

/**
 * Discount applies only to items that form complete pairs.
 * e.g. qty 3 → 1 pair (2 items discounted), qty 5 → 2 pairs (4 items discounted)
 */
export function createDoubleOrderDiscount(
  menuItems: Map<string, MenuItemPriceInfo>
): DiscountStrategy {
  return {
    kind: "doubleOrderDiscount",
    name: "5% Double Order Discount",

    isApplicable: (ctx) =>
      ctx.items.some((item) => {
        const menuItem = menuItems.get(item.menuItemId);
        return menuItem?.hasDoubleOrderDiscount && item.quantity >= PAIR_SIZE;
      }),

    calculate: (ctx) => {
      let discountableAmount = 0;

      for (const item of ctx.items) {
        const menuItem = menuItems.get(item.menuItemId);
        if (menuItem?.hasDoubleOrderDiscount && item.quantity >= PAIR_SIZE) {
          const pairedQty = Math.floor(item.quantity / PAIR_SIZE) * PAIR_SIZE;
          discountableAmount += menuItem.price * pairedQty;
        }
      }

      return Math.round(discountableAmount * DISCOUNT_RATE * 100) / 100;
    },
  };
}
