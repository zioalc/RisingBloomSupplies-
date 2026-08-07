import type { Locale } from "@/lib/i18n";
import {
  OAUTH_COOKIE_MAX_AGE_SECONDS,
  OAUTH_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/config";
import { decryptPayload, encryptPayload } from "@/lib/auth/crypto";

export type OAuthPendingState = {
  state: string;
  nonce: string;
  codeVerifier: string;
  locale: Locale;
  returnTo: string;
};

export type CustomerSessionTokens = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
};

function cookieBase(secure: boolean): string {
  return [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function serializeOAuthCookie(
  value: OAuthPendingState,
  secret: string,
  secure: boolean,
): string {
  const encrypted = encryptPayload(JSON.stringify(value), secret);
  return `${OAUTH_COOKIE_NAME}=${encrypted}; ${cookieBase(secure)}; Max-Age=${OAUTH_COOKIE_MAX_AGE_SECONDS}`;
}

export function clearOAuthCookie(secure: boolean): string {
  return `${OAUTH_COOKIE_NAME}=; ${cookieBase(secure)}; Max-Age=0`;
}

export function serializeSessionCookie(
  value: CustomerSessionTokens,
  secret: string,
  secure: boolean,
): string {
  const encrypted = encryptPayload(JSON.stringify(value), secret);
  return `${SESSION_COOKIE_NAME}=${encrypted}; ${cookieBase(secure)}; Max-Age=${SESSION_COOKIE_MAX_AGE_SECONDS}`;
}

export function clearSessionCookie(secure: boolean): string {
  return `${SESSION_COOKIE_NAME}=; ${cookieBase(secure)}; Max-Age=0`;
}

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${name}=`)) continue;
    return trimmed.slice(name.length + 1);
  }
  return null;
}

export function readOAuthCookie(
  cookieHeader: string | null,
  secret: string,
): OAuthPendingState | null {
  const raw = readCookie(cookieHeader, OAUTH_COOKIE_NAME);
  if (!raw) return null;

  const decrypted = decryptPayload(raw, secret);
  if (!decrypted) return null;

  try {
    const parsed = JSON.parse(decrypted) as Partial<OAuthPendingState>;
    if (
      !parsed.state ||
      !parsed.nonce ||
      !parsed.codeVerifier ||
      !parsed.locale ||
      !parsed.returnTo
    ) {
      return null;
    }
    return {
      state: parsed.state,
      nonce: parsed.nonce,
      codeVerifier: parsed.codeVerifier,
      locale: parsed.locale === "es" ? "es" : "en",
      returnTo: parsed.returnTo,
    };
  } catch {
    return null;
  }
}

export function readSessionCookie(
  cookieHeader: string | null,
  secret: string,
): CustomerSessionTokens | null {
  const raw = readCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (!raw) return null;

  const decrypted = decryptPayload(raw, secret);
  if (!decrypted) return null;

  try {
    const parsed = JSON.parse(decrypted) as Partial<CustomerSessionTokens>;
    if (
      !parsed.accessToken ||
      !parsed.refreshToken ||
      !parsed.idToken ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      idToken: parsed.idToken,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}
