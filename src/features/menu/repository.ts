import { dbConnect } from "@/lib/mongodb";
import { MenuItemModel } from "@/lib/models/menu-item.model";
import { MenuItem } from "./types";

export const menuItemRepository = {
  async findAll(): Promise<MenuItem[]> {
    await dbConnect();
    const items = await MenuItemModel.find().sort({ createdAt: 1 }).lean();

    return items.map((item) => ({
      id: item.slug,
      name: item.name,
      price: item.price,
      description: item.description,
      hasDoubleOrderDiscount: item.hasDoubleOrderDiscount,
    }));
  },
};
