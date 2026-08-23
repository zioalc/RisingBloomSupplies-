/**
 * Temporary browser-session cart lines for post-login checkout resume.
 * Stores only Shopify variant GIDs + quantities — never tokens or PII.
 */

export const PENDING_CHECKOUT_STORAGE_KEY = "rise-bloom-pending-checkout";

export type PendingCheckoutLine = {
  variantId: string;
  quantity: number;
};

type PendingCheckoutPayload = {
  lines: PendingCheckoutLine[];
};

function isValidLine(value: unknown): value is PendingCheckoutLine {
  if (!value || typeof value !== "object") return false;
  const line = value as { variantId?: unknown; quantity?: unknown };
  if (
    typeof line.variantId !== "string" ||
    !line.variantId.startsWith("gid://shopify/ProductVariant/")
  ) {
    return false;
  }
  const quantity = Number(line.quantity);
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= 100;
}

function parsePayload(raw: string): PendingCheckoutLine[] | null {
  try {
    const parsed = JSON.parse(raw) as PendingCheckoutPayload | PendingCheckoutLine[];
    const lines = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.lines)
        ? parsed.lines
        : null;
    if (!lines || lines.length === 0) return null;
    if (!lines.every(isValidLine)) return null;
    return lines.map((line) => ({
      variantId: line.variantId,
      quantity: Number(line.quantity),
    }));
  } catch {
    return null;
  }
}

export function savePendingCheckout(lines: PendingCheckoutLine[]): void {
  if (typeof window === "undefined") return;
  if (!lines.length || !lines.every(isValidLine)) return;

  const payload: PendingCheckoutPayload = {
    lines: lines.map((line) => ({
      variantId: line.variantId,
      quantity: line.quantity,
    })),
  };

  try {
    window.sessionStorage.setItem(
      PENDING_CHECKOUT_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    // Private mode / quota — resume will show missing-cart recovery.
  }
}

export function readPendingCheckout(): PendingCheckoutLine[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(PENDING_CHECKOUT_STORAGE_KEY);
    if (!raw) return null;
    return parsePayload(raw);
  } catch {
    return null;
  }
}

export function clearPendingCheckout(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(PENDING_CHECKOUT_STORAGE_KEY);
  } catch {
    // Ignore storage failures on clear.
  }
}
