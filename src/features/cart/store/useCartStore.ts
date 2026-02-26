import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import type { CartStore, PriceFetcher } from "../types";
import * as R from "./reducers";
import { fetchPriceCalculation } from "@/features/pricing/api";

export type { CartState } from "../types";
export type { CartStore } from "../types";
export { EMPTY_BREAKDOWN, selectTotalItems, selectItemQuantity } from "./reducers";

export function createCartStore() {
  return create<CartStore>()(
    subscribeWithSelector((set, get) => ({
      items: [],
      isMember: false,
      priceBreakdown: R.EMPTY_BREAKDOWN,
      isCalculating: false,

      addItem: (menuItemId) => set(R.addItem(get(), menuItemId)),

      removeItem: (menuItemId) => {
        const patch = R.removeItem(get(), menuItemId);
        if (patch) set(patch);
      },

      toggleMember: () => set((s) => R.toggleMember(s)),

      clearCart: () => set(R.clearCart()),
    }))
  );
}

export const useCartStore = createCartStore();

export function setupPriceSync(
  store: ReturnType<typeof createCartStore>,
  fetchFn: PriceFetcher,
  debounceMs = 300
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let controller: AbortController | null = null;

  return store.subscribe(
    (s) => ({ items: s.items, isMember: s.isMember }),
    ({ items, isMember }) => {
      if (timer) clearTimeout(timer);
      if (controller) controller.abort();

      if (items.length === 0) {
        store.setState({
          priceBreakdown: R.EMPTY_BREAKDOWN,
          isCalculating: false,
        });
        return;
      }

      timer = setTimeout(async () => {
        const ctrl = new AbortController();
        controller = ctrl;
        try {
          const result = await fetchFn(items, isMember, ctrl.signal);
          if (!ctrl.signal.aborted) {
            store.setState({ priceBreakdown: result, isCalculating: false });
          }
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === "AbortError") return;
          if (!ctrl.signal.aborted) {
            store.setState({ isCalculating: false });
          }
        }
      }, debounceMs);
    },
    { equalityFn: shallow }
  );
}

setupPriceSync(useCartStore, fetchPriceCalculation);
