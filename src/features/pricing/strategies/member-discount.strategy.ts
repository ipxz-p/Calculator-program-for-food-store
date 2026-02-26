import { DiscountStrategy } from "../types";

const MEMBER_DISCOUNT_RATE = 0.1;

export function createMemberDiscount(): DiscountStrategy {
  return {
    kind: "memberDiscount",
    name: "10% Member Card Discount",
    isApplicable: (ctx) => ctx.isMember,
    calculate: (ctx) =>
      Math.round(ctx.runningTotal * MEMBER_DISCOUNT_RATE * 100) / 100,
  };
}
