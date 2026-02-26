import { fetchPriceCalculation } from "@/features/pricing/api";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("fetchPriceCalculation", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches and returns price calculation successfully", async () => {
    const mockResponse = {
      subtotal: 100,
      discounts: [],
      total: 100,
    };

    const jsonMock = vi.fn().mockResolvedValue(mockResponse);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jsonMock,
    });

    const result = await fetchPriceCalculation(
      [{ menuItemId: "red", quantity: 1 }],
      false
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/calculate",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ menuItemId: "red", quantity: 1 }],
          isMember: false,
        }),
      })
    );

    expect(jsonMock).toHaveBeenCalled();

    expect(result).toEqual(mockResponse);
  });

  it("passes abort signal to fetch", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        subtotal: 0,
        discounts: [],
        total: 0,
      }),
    });

    const controller = new AbortController();

    await fetchPriceCalculation([], false, controller.signal);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/calculate",
      expect.objectContaining({
        signal: controller.signal,
      })
    );
  });

  it("throws error when response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(
      fetchPriceCalculation([], false)
    ).rejects.toThrow("Calculate API error: 500");
  });

  it("propagates network errors (fetch rejects)", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network down"));

    await expect(
      fetchPriceCalculation([], false)
    ).rejects.toThrow("Network down");
  });
});