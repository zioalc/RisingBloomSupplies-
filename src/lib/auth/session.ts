import {
  getCustomerAccountAuthConfig,
  isSecureCookieRequest,
} from "@/lib/auth/config";
import {
  clearSessionCookie,
  readSessionCookie,
  serializeSessionCookie,
  type CustomerSessionTokens,
} from "@/lib/auth/cookies";
import { refreshAccessToken } from "@/lib/auth/tokens";

export type ResolvedCustomerSession = {
  tokens: CustomerSessionTokens;
  /** Set-Cookie header if tokens were refreshed. */
  setCookie?: string;
};

export async function getValidCustomerSession(
  request: Request,
): Promise<ResolvedCustomerSession | null> {
  let config;
  try {
    config = getCustomerAccountAuthConfig();
  } catch {
    return null;
  }

  const secure = isSecureCookieRequest(request);
  const existing = readSessionCookie(
    request.headers.get("cookie"),
    config.authSecret,
  );
  if (!existing) return null;

  if (existing.expiresAt > Date.now()) {
    return { tokens: existing };
  }

  try {
    const refreshed = await refreshAccessToken({
      shopDomain: config.shopDomain,
      clientId: config.clientId,
      origin: config.origin,
      refreshToken: existing.refreshToken,
    });

    return {
      tokens: refreshed,
      setCookie: serializeSessionCookie(
        refreshed,
        config.authSecret,
        secure,
      ),
    };
  } catch {
    return null;
  }
}

export function expiredSessionClearCookie(request: Request): string {
  return clearSessionCookie(isSecureCookieRequest(request));
}
