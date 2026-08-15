import { discoverCustomerAccountApi } from "@/lib/auth/discovery";
import { getCustomerAccountAuthConfig } from "@/lib/auth/config";

export type CustomerOrderSummary = {
  id: string;
  name: string;
  processedAt: string | null;
  financialStatus: string | null;
  totalPrice: {
    amount: string;
    currencyCode: string;
  } | null;
};

export type CustomerAccountProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  displayName: string;
  orders: CustomerOrderSummary[];
};

/** Safe, non-PII reason codes for account GraphQL diagnostics. */
export type CustomerAccountFetchReason =
  | "ok"
  | "graphql_http_error"
  | "graphql_unauthorized"
  | "customer_unavailable"
  | "access_denied"
  | "orders_unavailable"
  | "unknown_graphql_error";

export type CustomerAccountFetchResult =
  | {
      ok: true;
      profile: CustomerAccountProfile;
      warning?: Extract<CustomerAccountFetchReason, "orders_unavailable">;
    }
  | {
      ok: false;
      reason: Exclude<CustomerAccountFetchReason, "ok" | "orders_unavailable">;
    };

type GraphQlError = {
  message?: string;
  extensions?: { code?: string };
};

type CustomerNode = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: { emailAddress?: string | null } | null;
  orders?: {
    edges?: Array<{
      node?: {
        id: string;
        name?: string | null;
        processedAt?: string | null;
        financialStatus?: string | null;
        totalPrice?: {
          amount: string;
          currencyCode: string;
        } | null;
      } | null;
    } | null>;
  } | null;
};

const CUSTOMER_PROFILE_QUERY = `
  query CustomerAccountProfile {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`;

const CUSTOMER_ORDERS_QUERY = `
  query CustomerAccountOrders {
    customer {
      id
      orders(first: 25) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

function buildDisplayName(
  firstName: string | null,
  lastName: string | null,
  email: string | null,
): string {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  if (name) return name;
  if (email) return email;
  return "Account";
}

type CustomerAccountFailureReason = Exclude<
  CustomerAccountFetchReason,
  "ok" | "orders_unavailable"
>;

function classifyGraphqlErrors(
  errors: GraphQlError[] | undefined,
): CustomerAccountFailureReason {
  if (!errors?.length) return "unknown_graphql_error";

  const codes = errors
    .map((error) => error.extensions?.code?.toUpperCase())
    .filter((code): code is string => Boolean(code));

  if (codes.some((code) => code.includes("ACCESS") || code === "FORBIDDEN")) {
    return "access_denied";
  }

  return "unknown_graphql_error";
}

function mapOrders(customer: CustomerNode | null | undefined): CustomerOrderSummary[] {
  return (customer?.orders?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => Boolean(node?.id))
    .map((node) => ({
      id: node.id,
      name: node.name ?? "Order",
      processedAt: node.processedAt ?? null,
      financialStatus: node.financialStatus ?? null,
      totalPrice: node.totalPrice
        ? {
            amount: node.totalPrice.amount,
            currencyCode: node.totalPrice.currencyCode,
          }
        : null,
    }));
}

async function customerAccountGraphql<T>(
  accessToken: string,
  query: string,
): Promise<
  | { ok: true; data: T; errors?: GraphQlError[] }
  | { ok: false; reason: CustomerAccountFailureReason }
> {
  const { shopDomain, origin } = getCustomerAccountAuthConfig();
  const { graphql_api } = await discoverCustomerAccountApi(shopDomain);

  // The Customer Account API expects the raw access token in Authorization.
  // The Origin header must match a configured JavaScript origin, and a
  // User-Agent is required or Shopify answers 403.
  const bareToken = accessToken.replace(/^Bearer\s+/i, "");
  const post = (authorization: string) =>
    fetch(graphql_api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        Origin: origin,
        "User-Agent": "RiseAndBloomStorefront/1.0",
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

  let response = await post(bareToken);
  if (response.status === 401 || response.status === 403) {
    response = await post(`Bearer ${bareToken}`);
  }

  if (!response.ok) {
    return {
      ok: false,
      reason:
        response.status === 401 || response.status === 403
          ? "graphql_unauthorized"
          : "graphql_http_error",
    };
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: GraphQlError[];
  };

  if (!payload.data) {
    return { ok: false, reason: classifyGraphqlErrors(payload.errors) };
  }

  return {
    ok: true,
    data: payload.data,
    errors: payload.errors,
  };
}

/**
 * Load customer profile first, then orders separately so an orders-only
 * permission/field failure does not wipe the whole account page.
 */
export async function fetchCustomerAccountProfile(
  accessToken: string,
  options: { includeOrders?: boolean } = {},
): Promise<CustomerAccountFetchResult> {
  const includeOrders = options.includeOrders ?? true;

  const profileResult = await customerAccountGraphql<{
    customer?: CustomerNode | null;
  }>(accessToken, CUSTOMER_PROFILE_QUERY);

  if (!profileResult.ok) {
    return profileResult;
  }

  const customer = profileResult.data.customer;
  if (!customer?.id) {
    return {
      ok: false,
      reason: profileResult.errors?.length
        ? classifyGraphqlErrors(profileResult.errors)
        : "customer_unavailable",
    };
  }

  // Profile fields may partially fail under protected-data rules; keep what we have.
  const email = customer.emailAddress?.emailAddress ?? null;
  const firstName = customer.firstName ?? null;
  const lastName = customer.lastName ?? null;

  let orders: CustomerOrderSummary[] = [];
  let warning: "orders_unavailable" | undefined;

  if (includeOrders) {
    const ordersResult = await customerAccountGraphql<{
      customer?: CustomerNode | null;
    }>(accessToken, CUSTOMER_ORDERS_QUERY);

    if (
      !ordersResult.ok ||
      ordersResult.errors?.length ||
      !ordersResult.data.customer
    ) {
      warning = "orders_unavailable";
    } else {
      orders = mapOrders(ordersResult.data.customer);
    }
  }

  return {
    ok: true,
    warning,
    profile: {
      id: customer.id,
      firstName,
      lastName,
      email,
      displayName: buildDisplayName(firstName, lastName, email),
      orders,
    },
  };
}
