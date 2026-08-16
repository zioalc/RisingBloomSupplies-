import { NextResponse } from "next/server";
import { createCheckout, type ShopifyCartLineInput } from "@/lib/shopify";

export const dynamic = "force-dynamic";

type CheckoutRequest = {
  lines?: Array<{ variantId?: unknown; quantity?: unknown }>;
};

function parseLines(body: CheckoutRequest): ShopifyCartLineInput[] | null {
  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return null;
  }

  const lines: ShopifyCartLineInput[] = [];
  for (const line of body.lines) {
    if (
      typeof line.variantId !== "string" ||
      !line.variantId.startsWith("gid://shopify/ProductVariant/")
    ) {
      return null;
    }

    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return null;
    }

    lines.push({ merchandiseId: line.variantId, quantity });
  }

  return lines;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const lines = parseLines(body);
    if (!lines) {
      return NextResponse.json(
        { error: "invalid_checkout" },
        { status: 400 },
      );
    }

    const checkoutUrl = await createCheckout(lines);
    return NextResponse.json({ checkoutUrl });
  } catch {
    return NextResponse.json(
      { error: "checkout_unavailable" },
      { status: 502 },
    );
  }
}
