import { CartItem } from "./types";

export function addItemToList(
  items: CartItem[],
  menuItemId: string
): CartItem[] {
  const existing = items.find((i) => i.menuItemId === menuItemId);
  return existing
    ? items.map((i) =>
        i.menuItemId === menuItemId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    : [...items, { menuItemId, quantity: 1 }];
}

export function removeItemFromList(
  items: CartItem[],
  menuItemId: string
): CartItem[] | null {
  const existing = items.find((i) => i.menuItemId === menuItemId);
  if (!existing) return null;

  return existing.quantity === 1
    ? items.filter((i) => i.menuItemId !== menuItemId)
    : items.map((i) =>
        i.menuItemId === menuItemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
}
