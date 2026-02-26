import { menuItemRepository } from "./repository";
import { MenuItem } from "./types";

export async function getMenuItems(): Promise<MenuItem[]> {
  return menuItemRepository.findAll();
}
