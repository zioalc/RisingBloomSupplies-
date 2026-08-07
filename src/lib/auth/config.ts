import type { Locale } from "@/lib/i18n";

export const AUTH_SCOPE = "openid email customer-account-api:full";

export const OAUTH_COOKIE_NAME = "rb_oauth";
export const SESSION_COOKIE_NAME = "rb_session";

export const OAUTH_COOKIE_MAX_AGE_SECONDS = 60 * 10; // 10 minutes
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type CustomerAccountAuthConfig = {
  shopDomain: string;
  clientId: string;
  callbackUrl: string;
  origin: string;
  authSecret: string;
};

export function getCustomerAccountAuthConfig(): CustomerAccountAuthConfig {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID?.trim();
  const callbackUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL?.trim();
  const authSecret = process.env.AUTH_SECRET?.trim();

  if (!shopDomain || !clientId || !callbackUrl || !authSecret) {
    throw new Error("Customer Account auth is not configured.");
  }

  let origin: string;
  try {
    origin = new URL(callbackUrl).origin;
  } catch {
    throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL is invalid.");
  }

  return { shopDomain, clientId, callbackUrl, origin, authSecret };
}

export function isSecureCookieRequest(request: Request): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) {
    return proto.split(",")[0]?.trim() === "https";
  }
  return new URL(request.url).protocol === "https:";
}

export function resolveAuthLocale(value: string | null | undefined): Locale {
  return value === "es" ? "es" : "en";
}

export function defaultPostLoginPath(locale: Locale): string {
  return `/${locale}/account`;
}

export function defaultPostLogoutUrl(locale: Locale, origin: string): string {
  return `${origin}/${locale}`;
}

/** Absolute URL on the configured storefront origin (avoids apex/www host drift). */
export function absoluteOnAuthOrigin(
  origin: string,
  path: string,
): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, origin).toString();
}
