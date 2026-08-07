import type { CustomerSessionTokens } from "@/lib/auth/cookies";
import { discoverOpenIdConfiguration } from "@/lib/auth/discovery";

export type TokenEndpointResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
};

type TokenRequestOptions = {
  shopDomain: string;
  clientId: string;
  origin: string;
  body: URLSearchParams;
};

async function postTokenEndpoint({
  shopDomain,
  clientId,
  origin,
  body,
}: TokenRequestOptions): Promise<TokenEndpointResponse> {
  const openId = await discoverOpenIdConfiguration(shopDomain);

  body.set("client_id", clientId);

  const response = await fetch(openId.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Origin: origin,
      "User-Agent": "RiseAndBloomStorefront/1.0",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Token request failed.");
  }

  const data = (await response.json()) as Partial<TokenEndpointResponse>;
  if (
    !data.access_token ||
    !data.refresh_token ||
    !data.id_token ||
    typeof data.expires_in !== "number"
  ) {
    throw new Error("Token response incomplete.");
  }

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    id_token: data.id_token,
    refresh_token: data.refresh_token,
  };
}

export function toSessionTokens(
  token: TokenEndpointResponse,
): CustomerSessionTokens {
  // Refresh slightly before expiry.
  const skewMs = 60_000;
  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    idToken: token.id_token,
    expiresAt: Date.now() + token.expires_in * 1000 - skewMs,
  };
}

export async function exchangeAuthorizationCode(options: {
  shopDomain: string;
  clientId: string;
  origin: string;
  callbackUrl: string;
  code: string;
  codeVerifier: string;
}): Promise<CustomerSessionTokens> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    redirect_uri: options.callbackUrl,
    code: options.code,
    code_verifier: options.codeVerifier,
  });

  const token = await postTokenEndpoint({
    shopDomain: options.shopDomain,
    clientId: options.clientId,
    origin: options.origin,
    body,
  });

  return toSessionTokens(token);
}

export async function refreshAccessToken(options: {
  shopDomain: string;
  clientId: string;
  origin: string;
  refreshToken: string;
}): Promise<CustomerSessionTokens> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: options.refreshToken,
  });

  const token = await postTokenEndpoint({
    shopDomain: options.shopDomain,
    clientId: options.clientId,
    origin: options.origin,
    body,
  });

  return toSessionTokens(token);
}
