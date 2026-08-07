import { NextResponse } from "next/server";
import { mapShopProducts, type ProductViewData } from "@/lib/products";
import {
  getProductByHandle,
  getProductsByIds,
  type ShopifyProduct,
} from "@/lib/shopify";

export const dynamic = "force-dynamic";

type WishlistRequestItem = {
  productId?: string;
  handle?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: WishlistRequestItem[] };
    const items = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json({ products: [], missingIds: [] });
    }

    const ids = items
      .map((item) => item.productId)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    const { products: byId, missingIds } = await getProductsByIds(ids);

    const foundById = new Set(byId.map((product) => product.id));
    const handleFallbacks = items.filter(
      (item) =>
        typeof item.handle === "string" &&
        item.handle.length > 0 &&
        (!item.productId || missingIds.includes(item.productId)),
    );

    const byHandle: ShopifyProduct[] = [];
    const recoveredIds = new Set<string>();

    await Promise.all(
      handleFallbacks.map(async (item) => {
        const handle = item.handle as string;
        try {
          const product = await getProductByHandle(handle);
          if (product && !foundById.has(product.id)) {
            byHandle.push(product);
            foundById.add(product.id);
            if (item.productId) recoveredIds.add(item.productId);
          }
        } catch {
          // leave as missing
        }
      }),
    );

    const stillMissing = missingIds.filter((id) => !recoveredIds.has(id));
    const merged = [...byId, ...byHandle];

    // Preserve wishlist order when possible
    const byKey = new Map<string, ProductViewData>();
    for (const product of mapShopProducts(merged)) {
      byKey.set(product.productId, product);
      if (product.handle) byKey.set(product.handle, product);
    }

    const ordered: ProductViewData[] = [];
    const seen = new Set<string>();

    for (const item of items) {
      const match =
        (item.productId ? byKey.get(item.productId) : undefined) ??
        (item.handle ? byKey.get(item.handle) : undefined);
      if (match && !seen.has(match.productId)) {
        ordered.push(match);
        seen.add(match.productId);
      }
    }

    for (const product of mapShopProducts(merged)) {
      if (!seen.has(product.productId)) {
        ordered.push(product);
        seen.add(product.productId);
      }
    }

    return NextResponse.json({
      products: ordered,
      missingIds: stillMissing,
    });
  } catch (error) {
    console.error("Wishlist product resolve failed:", error);
    return NextResponse.json(
      { products: [], missingIds: [], error: "Wishlist unavailable" },
      { status: 500 },
    );
  }
}
