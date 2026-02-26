import { CartItem } from "@/features/cart/types";
import { CalculatePriceResponse } from "./types";

export async function fetchPriceCalculation(
  items: CartItem[],
  isMember: boolean,
  signal?: AbortSignal
): Promise<CalculatePriceResponse> {
  const res = await fetch("/api/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, isMember }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Calculate API error: ${res.status}`);
  }

  return res.json();
}
