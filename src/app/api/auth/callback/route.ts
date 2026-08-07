import { NextResponse } from "next/server";
import {
  defaultPostLoginPath,
  getCustomerAccountAuthConfig,
  isSecureCookieRequest,
  resolveAuthLocale,
} from "@/lib/auth/config";
import {
  clearOAuthCookie,
  readOAuthCookie,
  serializeSessionCookie,
} from "@/lib/auth/cookies";
import { decodeJwtPayload } from "@/lib/auth/pkce";
import { exchangeAuthorizationCode } from "@/lib/auth/tokens";
import { localizedPath } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function redirectToAccount(
  request: Request,
  locale: "en" | "es",
  query: string,
  clearCookies: string[],
) {
  const response = NextResponse.redirect(
    new URL(`${localizedPath(locale, "/account")}?${query}`, request.url),
  );
  for (const cookie of clearCookies) {
    response.headers.append("Set-Cookie", cookie);
  }
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secure = isSecureCookieRequest(request);
  const clearOauth = clearOAuthCookie(secure);

  let config;
  try {
    config = getCustomerAccountAuthConfig();
  } catch {
    return redirectToAccount(request, "en", "auth=error", [clearOauth]);
  }

  const oauth = readOAuthCookie(
    request.headers.get("cookie"),
    config.authSecret,
  );
  const locale = resolveAuthLocale(oauth?.locale);

  const errorParam = url.searchParams.get("error");
  if (errorParam) {
    return redirectToAccount(request, locale, "auth=denied", [clearOauth]);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state || !oauth || oauth.state !== state) {
    return redirectToAccount(request, locale, "auth=error", [clearOauth]);
  }

  try {
    const tokens = await exchangeAuthorizationCode({
      shopDomain: config.shopDomain,
      clientId: config.clientId,
      origin: config.origin,
      callbackUrl: config.callbackUrl,
      code,
      codeVerifier: oauth.codeVerifier,
    });

    const payload = decodeJwtPayload(tokens.idToken);
    const tokenNonce =
      payload && typeof payload.nonce === "string" ? payload.nonce : null;

    if (!tokenNonce || tokenNonce !== oauth.nonce) {
      return redirectToAccount(request, locale, "auth=error", [clearOauth]);
    }

    const returnTo =
      oauth.returnTo.startsWith("/") && !oauth.returnTo.startsWith("//")
        ? oauth.returnTo
        : defaultPostLoginPath(locale);

    const response = NextResponse.redirect(new URL(returnTo, request.url));
    response.headers.append("Set-Cookie", clearOauth);
    response.headers.append(
      "Set-Cookie",
      serializeSessionCookie(tokens, config.authSecret, secure),
    );
    return response;
  } catch {
    return redirectToAccount(request, locale, "auth=error", [clearOauth]);
  }
}
