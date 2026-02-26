import { describe, it, expect, beforeEach } from "vitest";
import {
  createCartStore,
  selectTotalItems,
  selectItemQuantity,
} from "@/features/cart/store/useCartStore";

type Store = ReturnType<typeof createCartStore>;

describe("CartStore", () => {
  let store: Store;

  const state = () => store.getState();

  const seed = (...ids: string[]) => {
    const { addItem } = state();
    ids.forEach(addItem);
  };

  beforeEach(() => {
    store = createCartStore();
  });

  describe("addItem", () => {
    it("adds new item", () => {
      state().addItem("red");

      expect(state().items).toEqual([{ menuItemId: "red", quantity: 1 }]);
    });

    it("increments existing item", () => {
      seed("red", "red");

      expect(state().items).toEqual([{ menuItemId: "red", quantity: 2 }]);
    });

    it("keeps other items intact", () => {
      seed("red", "blue", "red");

      expect(state().items).toEqual([
        { menuItemId: "red", quantity: 2 },
        { menuItemId: "blue", quantity: 1 },
      ]);
    });

    it("marks isCalculating true", () => {
      state().addItem("red");

      expect(state().isCalculating).toBe(true);
    });
  });

  describe("removeItem", () => {
    it("decrements quantity", () => {
      seed("red", "red");
      state().removeItem("red");

      expect(state().items).toEqual([{ menuItemId: "red", quantity: 1 }]);
    });

    it("removes item at 0 quantity", () => {
      seed("red");
      state().removeItem("red");

      expect(state().items).toEqual([]);
    });

    it("is no-op for unknown item", () => {
      seed("red");
      state().removeItem("blue");

      expect(state().items).toEqual([{ menuItemId: "red", quantity: 1 }]);
    });

    it("handles isCalculating correctly", () => {
      seed("red", "blue");
      store.setState({ isCalculating: false });

      state().removeItem("red");

      expect(state().isCalculating).toBe(true);
    });

    it("resets isCalculating when cart empty", () => {
      seed("red");
      state().removeItem("red");

      expect(state().isCalculating).toBe(false);
    });
  });

  describe("toggleMember", () => {
    it("toggles boolean", () => {
      state().toggleMember();
      expect(state().isMember).toBe(true);

      state().toggleMember();
      expect(state().isMember).toBe(false);
    });

    it("marks isCalculating only when cart has items", () => {
      seed("red");
      store.setState({ isCalculating: false });

      state().toggleMember();
      expect(state().isCalculating).toBe(true);
    });

    it("does not mark isCalculating when empty", () => {
      state().toggleMember();

      expect(state().isCalculating).toBe(false);
    });
  });

  describe("clearCart", () => {
    it("resets cart state but preserves membership", () => {
      seed("red", "blue");
      state().toggleMember();

      state().clearCart();

      expect(state().items).toEqual([]);
      expect(state().priceBreakdown).toEqual({
        subtotal: 0,
        discounts: [],
        total: 0,
      });
      expect(state().isCalculating).toBe(false);
      expect(state().isMember).toBe(true);
    });
  });

  describe("selectors", () => {
    it("selectTotalItems", () => {
      seed("red", "red", "blue");

      expect(selectTotalItems(state())).toBe(3);
    });

    it("selectItemQuantity", () => {
      seed("red", "red");

      expect(selectItemQuantity("red")(state())).toBe(2);
      expect(selectItemQuantity("blue")(state())).toBe(0);
    });
  });

  describe("immutability", () => {
    it.each([
      ["addItem", () => state().addItem("blue")],
      ["removeItem", () => state().removeItem("red")],
    ])("%s creates new items reference", (_, act) => {
      seed("red");
      const before = state().items;

      act();
      const after = state().items;

      expect(before).not.toBe(after);
    });

    it("does not mutate existing item objects", () => {
      seed("red");
      const before = state().items[0];

      state().addItem("red");
      const after = state().items[0];

      expect(before).not.toBe(after);
      expect(before.quantity).toBe(1);
      expect(after.quantity).toBe(2);
    });
  });
});
