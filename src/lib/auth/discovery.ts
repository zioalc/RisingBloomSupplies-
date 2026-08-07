export type OpenIdConfiguration = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
  jwks_uri?: string;
  issuer?: string;
};

export type CustomerAccountApiConfiguration = {
  graphql_api: string;
  mcp_api?: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Discovery request failed.");
  }

  return (await response.json()) as T;
}

export async function discoverOpenIdConfiguration(
  shopDomain: string,
): Promise<OpenIdConfiguration> {
  const config = await fetchJson<OpenIdConfiguration>(
    `https://${shopDomain}/.well-known/openid-configuration`,
  );

  if (!config.authorization_endpoint || !config.token_endpoint) {
    throw new Error("OpenID discovery response incomplete.");
  }

  return config;
}

export async function discoverCustomerAccountApi(
  shopDomain: string,
): Promise<CustomerAccountApiConfiguration> {
  const config = await fetchJson<CustomerAccountApiConfiguration>(
    `https://${shopDomain}/.well-known/customer-account-api`,
  );

  if (!config.graphql_api) {
    throw new Error("Customer Account API discovery response incomplete.");
  }

  return config;
}
