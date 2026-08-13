import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";
import { mapShopProducts } from "@/lib/products";
import { localeToShopifyLanguage, searchProducts } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const localeParam = searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : "en";

  if (!q) {
    return NextResponse.json({ products: [] });
  }

  try {
    const shopifyProducts = await searchProducts(
      q,
      localeToShopifyLanguage(locale),
      24,
    );
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
