import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMenuItems } from "@/features/menu/actions";
import { menuItemRepository } from "@/features/menu/repository";
import { MenuItem } from "@/features/menu/types";

vi.mock("@/features/menu/repository", () => ({
  menuItemRepository: {
    findAll: vi.fn(),
  },
}));

describe("getMenuItems", () => {
  const mockedFindAll = vi.mocked(menuItemRepository.findAll);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call repository.findAll", async () => {
    mockedFindAll.mockResolvedValueOnce([]);

    await getMenuItems();

    expect(mockedFindAll).toHaveBeenCalledTimes(1);
  });

  it("should return menu items from repository", async () => {
    const mockItems: MenuItem[] = [
      { id: "red", name: "Red", description: "Red description", hasDoubleOrderDiscount: false, price: 50 },
      { id: "green", name: "Green", description: "Green description", hasDoubleOrderDiscount: false, price: 40 },
    ];

    mockedFindAll.mockResolvedValueOnce(mockItems);

    const result = await getMenuItems();

    expect(result).toEqual(mockItems);
  });

  it("should propagate error from repository", async () => {
    mockedFindAll.mockRejectedValueOnce(new Error("DB error"));

    await expect(getMenuItems()).rejects.toThrow("DB error");
  });
});