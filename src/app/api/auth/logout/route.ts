import { NextResponse } from "next/server";
import {
  defaultPostLogoutUrl,
  getCustomerAccountAuthConfig,
  isSecureCookieRequest,
  resolveAuthLocale,
} from "@/lib/auth/config";
import {
  clearOAuthCookie,
  clearSessionCookie,
  readSessionCookie,
} from "@/lib/auth/cookies";
import { discoverOpenIdConfiguration } from "@/lib/auth/discovery";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = resolveAuthLocale(url.searchParams.get("locale"));
  const secure = isSecureCookieRequest(request);
  const clearCookies = [
    clearSessionCookie(secure),
    clearOAuthCookie(secure),
  ];

  let config;
  try {
    config = getCustomerAccountAuthConfig();
  } catch {
    const response = NextResponse.redirect(
      new URL(`/${locale}`, request.url),
    );
    for (const cookie of clearCookies) {
      response.headers.append("Set-Cookie", cookie);
    }
    return response;
  }

  const session = readSessionCookie(
    request.headers.get("cookie"),
    config.authSecret,
  );
  const postLogoutRedirectUri = defaultPostLogoutUrl(locale, config.origin);

  if (!session?.idToken) {
    const response = NextResponse.redirect(postLogoutRedirectUri);
    for (const cookie of clearCookies) {
      response.headers.append("Set-Cookie", cookie);
    }
    return response;
  }

  try {
    const openId = await discoverOpenIdConfiguration(config.shopDomain);
    if (!openId.end_session_endpoint) {
      const response = NextResponse.redirect(postLogoutRedirectUri);
      for (const cookie of clearCookies) {
        response.headers.append("Set-Cookie", cookie);
      }
      return response;
    }

    const logoutUrl = new URL(openId.end_session_endpoint);
    logoutUrl.searchParams.set("id_token_hint", session.idToken);
    logoutUrl.searchParams.set(
      "post_logout_redirect_uri",
      postLogoutRedirectUri,
    );
    logoutUrl.searchParams.set("client_id", config.clientId);

    const response = NextResponse.redirect(logoutUrl.toString());
    for (const cookie of clearCookies) {
      response.headers.append("Set-Cookie", cookie);
    }
    return response;
  } catch {
    const response = NextResponse.redirect(postLogoutRedirectUri);
    for (const cookie of clearCookies) {
      response.headers.append("Set-Cookie", cookie);
    }
    return response;
  }
}
