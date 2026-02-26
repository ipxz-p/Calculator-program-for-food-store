import { NextResponse } from "next/server";
import { menuItemRepository } from "@/features/menu/repository";

export async function GET() {
  try {
    const menuItems = await menuItemRepository.findAll();
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}
