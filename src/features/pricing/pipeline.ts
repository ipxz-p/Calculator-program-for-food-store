import { CartItem } from "@/features/cart/types";
import { DiscountStrategy, PipelineContext } from "./types";

export function createDiscountPipeline(strategies: DiscountStrategy[]) {
  return function execute(
    items: CartItem[],
    isMember: boolean,
    subtotal: number
  ): PipelineContext {
    const initial: PipelineContext = {
      items,
      isMember,
      subtotal,
      runningTotal: subtotal,
      discounts: [],
    };

    return strategies.reduce<PipelineContext>((ctx, strategy) => {
      if (!strategy.isApplicable(ctx)) return ctx;

      const amount = Math.min(strategy.calculate(ctx), ctx.runningTotal);
      if (amount <= 0) return ctx;

      return {
        ...ctx,
        runningTotal: ctx.runningTotal - amount,
        discounts: [
          ...ctx.discounts,
          { kind: strategy.kind, name: strategy.name, amount },
        ],
      };
    }, initial);
  };
}
