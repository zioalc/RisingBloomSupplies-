import { NextResponse } from "next/server";
import { mapShopProducts } from "@/lib/products";
import { searchProducts } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    return NextResponse.json({ products: [] });
  }

  try {
    const shopifyProducts = await searchProducts(q, 24);
    const products = mapShopProducts(shopifyProducts);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Product search failed:", error);
    return NextResponse.json(
      { products: [], error: "Search unavailable" },
      { status: 500 },
    );
  }
}
