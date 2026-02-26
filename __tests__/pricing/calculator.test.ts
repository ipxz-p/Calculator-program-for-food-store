import { describe, it, expect } from "vitest";
import { createPriceCalculator } from "@/features/pricing/calculator";
import { CartItem } from "@/features/cart/types";
import { MenuItemPriceInfo, PriceBreakdown } from "@/features/pricing/types";

const testMenuItems = new Map<string, MenuItemPriceInfo>([
  ["red", { price: 50, hasDoubleOrderDiscount: false }],
  ["green", { price: 40, hasDoubleOrderDiscount: true }],
  ["blue", { price: 30, hasDoubleOrderDiscount: false }],
  ["yellow", { price: 50, hasDoubleOrderDiscount: false }],
  ["pink", { price: 80, hasDoubleOrderDiscount: true }],
  ["purple", { price: 90, hasDoubleOrderDiscount: false }],
  ["orange", { price: 120, hasDoubleOrderDiscount: true }],
]);

function getDiscount(result: PriceBreakdown, kind: string): number {
  return result.discounts.find((d) => d.kind === kind)?.amount ?? 0;
}

describe("PriceCalculator", () => {
  const calculator = createPriceCalculator(testMenuItems);

  describe("calculateSubtotal", () => {
    it("should return 0 for empty cart", () => {
      expect(calculator.calculateSubtotal([])).toBe(0);
    });

    it("should calculate subtotal for single item", () => {
      const items: CartItem[] = [{ menuItemId: "red", quantity: 1 }];
      expect(calculator.calculateSubtotal(items)).toBe(50);
    });

    it("should ignore items that are not in the menu", () => {
      const items: CartItem[] = [{ menuItemId: "unknown", quantity: 1 }];
      expect(calculator.calculateSubtotal(items)).toBe(0);
    });

    it("should calculate subtotal for multiple items", () => {
      const items: CartItem[] = [
        { menuItemId: "red", quantity: 1 },
        { menuItemId: "green", quantity: 1 },
      ];
      expect(calculator.calculateSubtotal(items)).toBe(90);
    });

    it("should handle quantities greater than 1", () => {
      const items: CartItem[] = [{ menuItemId: "orange", quantity: 3 }];
      expect(calculator.calculateSubtotal(items)).toBe(360);
    });
  });

  describe("calculate (full pricing)", () => {
    it("should calculate price with no discounts", () => {
      const items: CartItem[] = [
        { menuItemId: "red", quantity: 1 },
        { menuItemId: "green", quantity: 1 },
      ];
      const result = calculator.calculate(items, false);

      expect(result.subtotal).toBe(90);
      expect(getDiscount(result, "doubleOrderDiscount")).toBe(0);
      expect(getDiscount(result, "memberDiscount")).toBe(0);
      expect(result.total).toBe(90);
      expect(result.discounts).toHaveLength(0);
    });

    it("should apply 10% member discount", () => {
      const items: CartItem[] = [
        { menuItemId: "red", quantity: 1 },
        { menuItemId: "green", quantity: 1 },
      ];
      const result = calculator.calculate(items, true);

      expect(result.subtotal).toBe(90);
      expect(getDiscount(result, "memberDiscount")).toBeCloseTo(9, 5);
      expect(result.total).toBeCloseTo(81, 5);
    });

    it("should apply 5% double order discount for Orange (2+ items)", () => {
      const items: CartItem[] = [{ menuItemId: "orange", quantity: 2 }];
      const result = calculator.calculate(items, false);

      expect(result.subtotal).toBe(240);
      expect(getDiscount(result, "doubleOrderDiscount")).toBeCloseTo(12, 5);
      expect(result.total).toBeCloseTo(228, 5);
    });

    it("should apply both pair and member discounts (member discount on reduced total)", () => {
      const items: CartItem[] = [{ menuItemId: "orange", quantity: 2 }];
      const result = calculator.calculate(items, true);

      expect(result.subtotal).toBe(240);
      expect(getDiscount(result, "doubleOrderDiscount")).toBeCloseTo(12, 5);
      expect(getDiscount(result, "memberDiscount")).toBeCloseTo(22.8, 5);
      expect(result.total).toBeCloseTo(205.2, 5);
    });

    it("should discount only paired items for odd quantity (orange x3)", () => {
      const items: CartItem[] = [
        { menuItemId: "red", quantity: 1 },
        { menuItemId: "orange", quantity: 3 },
      ];
      const result = calculator.calculate(items, false);

      expect(result.subtotal).toBe(410);
      expect(getDiscount(result, "doubleOrderDiscount")).toBeCloseTo(12, 5);
      expect(result.total).toBeCloseTo(398, 5);
    });

    it("should handle multiple eligible items with mixed even/odd quantities + member", () => {
      const items: CartItem[] = [
        { menuItemId: "orange", quantity: 3 },
        { menuItemId: "pink", quantity: 2 },
        { menuItemId: "green", quantity: 5 },
      ];
      const result = calculator.calculate(items, true);

      expect(result.subtotal).toBe(720);
      expect(getDiscount(result, "doubleOrderDiscount")).toBeCloseTo(28, 5);
      expect(getDiscount(result, "memberDiscount")).toBeCloseTo(69.2, 5);
      expect(result.total).toBeCloseTo(622.8, 5);
    });

    it("should return empty cart breakdown", () => {
      const result = calculator.calculate([], false);

      expect(result.subtotal).toBe(0);
      expect(result.total).toBe(0);
      expect(result.discounts).toHaveLength(0);
    });

    it("should preserve discount order in pipeline", () => {
      const items: CartItem[] = [{ menuItemId: "orange", quantity: 2 }];
      const result = calculator.calculate(items, true);

      expect(result.discounts).toHaveLength(2);
      expect(result.discounts[0].kind).toBe("doubleOrderDiscount");
      expect(result.discounts[1].kind).toBe("memberDiscount");
    });
  });
});