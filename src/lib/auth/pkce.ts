import { createHash, randomBytes } from "crypto";

function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/** RFC 7636 code_verifier: 43–128 URL-safe characters. */
export function generateCodeVerifier(): string {
  return base64UrlEncode(randomBytes(32));
}

/** S256 code_challenge = BASE64URL(SHA256(verifier)). */
export function generateCodeChallenge(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier, "ascii").digest("base64url");
}

export function generateState(): string {
  return base64UrlEncode(randomBytes(24));
}

export function generateNonce(): string {
  return base64UrlEncode(randomBytes(24));
}

/** Decode JWT payload without verifying signature (nonce check only). */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2 || !parts[1]) return null;

  try {
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (padded.length % 4)) % 4;
    const json = Buffer.from(padded + "=".repeat(padLength), "base64").toString(
      "utf8",
    );
    const payload = JSON.parse(json) as unknown;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return null;
    }
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}
