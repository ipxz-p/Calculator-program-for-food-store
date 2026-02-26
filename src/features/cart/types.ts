import { PriceBreakdown, CalculatePriceResponse } from "@/features/pricing/types";

export interface CartItem {
  menuItemId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isMember: boolean;
  priceBreakdown: PriceBreakdown;
  isCalculating: boolean;
}

export type CartPatch = Partial<CartState>;

export interface CartActions {
  addItem: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  toggleMember: () => void;
  clearCart: () => void;
}

export type CartStore = CartState & CartActions;

export type PriceFetcher = (
  items: CartItem[],
  isMember: boolean,
  signal?: AbortSignal,
) => Promise<CalculatePriceResponse>;
