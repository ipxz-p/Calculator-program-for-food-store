import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createCartStore,
  setupPriceSync,
  EMPTY_BREAKDOWN,
} from "@/features/cart/store/useCartStore";
import type { CartItem } from "@/features/cart/types";
import type { CalculatePriceResponse } from "@/features/pricing/types";

type Store = ReturnType<typeof createCartStore>;
type PriceFetcher = (
  items: CartItem[],
  isMember: boolean,
  signal?: AbortSignal
) => Promise<CalculatePriceResponse>;

const FAKE_RESULT: CalculatePriceResponse = {
  subtotal: 100,
  discounts: [{ kind: "member", name: "Member 10%", amount: 10 }],
  total: 90,
};

describe("setupPriceSync", () => {
  let store: Store;
  let fetchFn: ReturnType<typeof vi.fn<PriceFetcher>>;
  let unsub: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    store = createCartStore();
    fetchFn = vi.fn<PriceFetcher>().mockResolvedValue(FAKE_RESULT);
    unsub = setupPriceSync(store, fetchFn, 300);
  });

  afterEach(() => {
    unsub();
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it("does not fetch before debounce elapses", () => {
    store.getState().addItem("red");
    vi.advanceTimersByTime(299);

    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("fetches after debounce elapses", () => {
    store.getState().addItem("red");
    vi.advanceTimersByTime(300);

    expect(fetchFn).toHaveBeenCalledOnce();
    expect(fetchFn).toHaveBeenCalledWith(
      [{ menuItemId: "red", quantity: 1 }],
      false,
      expect.any(AbortSignal)
    );
  });

  it("resets debounce timer on rapid changes", () => {
    store.getState().addItem("red");
    vi.advanceTimersByTime(200);

    store.getState().addItem("blue");
    vi.advanceTimersByTime(200);
    expect(fetchFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fetchFn).toHaveBeenCalledOnce();
  });

  it("updates priceBreakdown and clears isCalculating after fetch resolves", async () => {
    store.getState().addItem("red");
    await vi.advanceTimersByTimeAsync(300);

    expect(store.getState().priceBreakdown).toEqual(FAKE_RESULT);
    expect(store.getState().isCalculating).toBe(false);
  });

  it("resets breakdown immediately when cart becomes empty", () => {
    store.getState().addItem("red");
    store.getState().removeItem("red");

    expect(store.getState().priceBreakdown).toEqual(EMPTY_BREAKDOWN);
    expect(store.getState().isCalculating).toBe(false);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("aborts previous in-flight request on new change", () => {
    store.getState().addItem("red");
    vi.advanceTimersByTime(300);

    const signal = fetchFn.mock.calls[0][2]!;

    store.getState().addItem("blue");
    expect(signal.aborted).toBe(true);
  });

  it("clears isCalculating on fetch error", async () => {
    fetchFn.mockRejectedValueOnce(new Error("Network error"));

    store.getState().addItem("red");
    await vi.advanceTimersByTimeAsync(300);

    expect(store.getState().isCalculating).toBe(false);
  });
});
