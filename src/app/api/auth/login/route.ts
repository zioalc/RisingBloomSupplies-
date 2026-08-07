import { NextResponse } from "next/server";
import {
  AUTH_SCOPE,
  defaultPostLoginPath,
  getCustomerAccountAuthConfig,
  isSecureCookieRequest,
  resolveAuthLocale,
} from "@/lib/auth/config";
import { serializeOAuthCookie } from "@/lib/auth/cookies";
import { discoverOpenIdConfiguration } from "@/lib/auth/discovery";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateNonce,
  generateState,
} from "@/lib/auth/pkce";
import { localizedPath } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function sanitizeReturnTo(value: string | null, locale: "en" | "es"): string {
  const fallback = defaultPostLoginPath(locale);
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.startsWith("/api/")) return fallback;
  return value;
}

export async function GET(request: Request) {
  try {
    const config = getCustomerAccountAuthConfig();
    const url = new URL(request.url);
    const locale = resolveAuthLocale(url.searchParams.get("locale"));
    const returnTo = sanitizeReturnTo(
      url.searchParams.get("returnTo"),
      locale,
    );

    const state = generateState();
    const nonce = generateNonce();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    const openId = await discoverOpenIdConfiguration(config.shopDomain);
    const authorizeUrl = new URL(openId.authorization_endpoint);
    authorizeUrl.searchParams.set("client_id", config.clientId);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("redirect_uri", config.callbackUrl);
    authorizeUrl.searchParams.set("scope", AUTH_SCOPE);
    authorizeUrl.searchParams.set("state", state);
    authorizeUrl.searchParams.set("nonce", nonce);
    authorizeUrl.searchParams.set("code_challenge", codeChallenge);
    authorizeUrl.searchParams.set("code_challenge_method", "S256");
    authorizeUrl.searchParams.set("locale", locale);

    const secure = isSecureCookieRequest(request);
    const response = NextResponse.redirect(authorizeUrl.toString());
    response.headers.append(
      "Set-Cookie",
      serializeOAuthCookie(
        { state, nonce, codeVerifier, locale, returnTo },
        config.authSecret,
        secure,
      ),
    );
    return response;
  } catch {
    const locale = resolveAuthLocale(
      new URL(request.url).searchParams.get("locale"),
    );
    return NextResponse.redirect(
      new URL(`${localizedPath(locale, "/account")}?auth=error`, request.url),
    );
  }
}
