import { describe, it, expect } from "vitest";
import {
  addItemToList,
  removeItemFromList,
} from "@/features/cart/helpers";
import { CartItem } from "@/features/cart/types";

describe("addItemToList", () => {
  it("should add new item with quantity 1", () => {
    expect(addItemToList([], "red")).toEqual([
      { menuItemId: "red", quantity: 1 },
    ]);
  });

  it("should increment quantity for existing item", () => {
    const items: CartItem[] = [{ menuItemId: "red", quantity: 1 }];
    expect(addItemToList(items, "red")).toEqual([
      { menuItemId: "red", quantity: 2 },
    ]);
  });

  it("should not mutate the original array", () => {
    const items: CartItem[] = [{ menuItemId: "red", quantity: 1 }];
    const result = addItemToList(items, "blue");
    expect(items).toHaveLength(1);
    expect(result).toHaveLength(2);
  });

  it("should keep other items untouched", () => {
    const items: CartItem[] = [
      { menuItemId: "red", quantity: 2 },
      { menuItemId: "blue", quantity: 1 },
    ];
    expect(addItemToList(items, "red")).toEqual([
      { menuItemId: "red", quantity: 3 },
      { menuItemId: "blue", quantity: 1 },
    ]);
  });
});

describe("removeItemFromList", () => {
  it("should return null for non-existent item", () => {
    expect(removeItemFromList([], "red")).toBeNull();
  });

  it("should decrement quantity", () => {
    const items: CartItem[] = [{ menuItemId: "red", quantity: 3 }];
    expect(removeItemFromList(items, "red")).toEqual([
      { menuItemId: "red", quantity: 2 },
    ]);
  });

  it("should remove item when quantity reaches 0", () => {
    const items: CartItem[] = [{ menuItemId: "red", quantity: 1 }];
    expect(removeItemFromList(items, "red")).toEqual([]);
  });

  it("should not affect other items", () => {
    const items: CartItem[] = [
      { menuItemId: "red", quantity: 1 },
      { menuItemId: "blue", quantity: 2 },
    ];
    expect(removeItemFromList(items, "red")).toEqual([
      { menuItemId: "blue", quantity: 2 },
    ]);
  });

  it("should not mutate the original array", () => {
    const items: CartItem[] = [{ menuItemId: "red", quantity: 2 }];
    removeItemFromList(items, "red");
    expect(items[0].quantity).toBe(2);
  });
});
