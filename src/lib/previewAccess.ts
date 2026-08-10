import type { NextRequest } from "next/server";

export const PREVIEW_COOKIE_NAME = "rb_storefront_preview";
export const PREVIEW_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

type PreviewPayload = {
  exp: number;
};

function previewBypassConfigured(): boolean {
  return (
    process.env.STOREFRONT_PREVIEW_ENABLED === "true" &&
    Boolean(process.env.STOREFRONT_PREVIEW_SECRET?.trim())
  );
}

function getPreviewSecret(): string | null {
  if (!previewBypassConfigured()) return null;
  return process.env.STOREFRONT_PREVIEW_SECRET!.trim();
}

function readCookieValue(
  cookieHeader: string | null,
  name: string,
): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${name}=`)) {
      return trimmed.slice(name.length + 1);
    }
  }
  return null;
}

function bufferToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (padded.length % 4)) % 4;
    const base64 = padded + "=".repeat(padLen);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

async function hmacSha256Base64Url(
  secret: string,
  message: string,
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bufferToBase64Url(new Uint8Array(signature));
}

/** Constant-time string compare without Node crypto (Edge-safe). */
function timingSafeEqualString(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBuf = enc.encode(a);
  const bBuf = enc.encode(b);
  if (aBuf.length !== bBuf.length) return false;

  let mismatch = 0;
  for (let i = 0; i < aBuf.length; i += 1) {
    mismatch |= aBuf[i]! ^ bBuf[i]!;
  }
  return mismatch === 0;
}

export function isPreviewKeyValid(provided: string | null): boolean {
  const secret = getPreviewSecret();
  if (!secret || !provided) return false;
  return timingSafeEqualString(provided, secret);
}

export async function createPreviewCookieValue(): Promise<string | null> {
  const secret = getPreviewSecret();
  if (!secret) return null;

  const payload: PreviewPayload = {
    exp: Date.now() + PREVIEW_COOKIE_MAX_AGE_SECONDS * 1000,
  };
  const payloadB64 = bufferToBase64Url(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const signature = await hmacSha256Base64Url(secret, payloadB64);
  return `${payloadB64}.${signature}`;
}

export async function hasValidPreviewCookie(
  request: NextRequest | Request,
): Promise<boolean> {
  const secret = getPreviewSecret();
  if (!secret) return false;

  const cookieHeader = request.headers.get("cookie");
  const token = readCookieValue(cookieHeader, PREVIEW_COOKIE_NAME);
  if (!token) return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;

  const payloadB64 = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = await hmacSha256Base64Url(secret, payloadB64);

  if (signature.length !== expected.length) return false;
  const sigBuf = new TextEncoder().encode(signature);
  const expBuf = new TextEncoder().encode(expected);
  if (sigBuf.length !== expBuf.length) return false;

  let mismatch = 0;
  for (let i = 0; i < sigBuf.length; i += 1) {
    mismatch |= sigBuf[i]! ^ expBuf[i]!;
  }
  if (mismatch !== 0) return false;

  const payloadBytes = base64UrlToBytes(payloadB64);
  if (!payloadBytes) return false;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(payloadBytes),
    ) as PreviewPayload;
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function serializePreviewCookie(
  value: string,
  secure: boolean,
): string {
  const base = [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  return `${PREVIEW_COOKIE_NAME}=${value}; ${base}; Max-Age=${PREVIEW_COOKIE_MAX_AGE_SECONDS}`;
}

export function clearPreviewCookie(secure: boolean): string {
  const base = [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  return `${PREVIEW_COOKIE_NAME}=; ${base}; Max-Age=0`;
}

export function isSecurePreviewRequest(request: Request): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) {
    return proto.split(",")[0]?.trim() === "https";
  }
  return new URL(request.url).protocol === "https:";
}
