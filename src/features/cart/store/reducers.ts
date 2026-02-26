import { CartState, CartPatch } from "../types";
import { addItemToList, removeItemFromList } from "../helpers";
import { PriceBreakdown } from "@/features/pricing/types";

export type { CartState, CartPatch };

export const EMPTY_BREAKDOWN: PriceBreakdown = {
  subtotal: 0,
  discounts: [],
  total: 0,
};

export function addItem(state: CartState, menuItemId: string): CartPatch {
  return {
    items: addItemToList(state.items, menuItemId),
    isCalculating: true,
  };
}

export function removeItem(
  state: CartState,
  menuItemId: string
): CartPatch | null {
  const updated = removeItemFromList(state.items, menuItemId);
  if (!updated) return null;
  return { items: updated, isCalculating: updated.length > 0 };
}

export function toggleMember(state: CartState): CartPatch {
  return { isMember: !state.isMember, isCalculating: state.items.length > 0 };
}

export function clearCart(): CartPatch {
  return { items: [], priceBreakdown: EMPTY_BREAKDOWN, isCalculating: false };
}

export function selectTotalItems(state: CartState): number {
  return state.items.reduce((sum, i) => sum + i.quantity, 0);
}

export function selectItemQuantity(menuItemId: string) {
  return (state: CartState): number =>
    state.items.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0;
}
