import { NextRequest, NextResponse } from "next/server";
import { menuItemRepository } from "@/features/menu/repository";
import { createPriceCalculator } from "@/features/pricing/calculator";
import {
  calculatePriceRequestSchema,
  MenuItemPriceInfo,
  CalculatePriceResponse,
} from "@/features/pricing/types";

export async function POST(request: NextRequest) {
  try {
    const parsed = calculatePriceRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, isMember } = parsed.data;

    const menuItems = await menuItemRepository.findAll();
    const priceMap = new Map<string, MenuItemPriceInfo>(
      menuItems.map((item) => [
        item.id,
        { price: item.price, hasDoubleOrderDiscount: item.hasDoubleOrderDiscount },
      ])
    );

    const calculator = createPriceCalculator(priceMap);
    const result: CalculatePriceResponse = calculator.calculate(items, isMember);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to calculate price" },
      { status: 500 }
    );
  }
}
