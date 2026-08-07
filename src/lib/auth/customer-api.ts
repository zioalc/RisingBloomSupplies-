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

type CustomerQueryResult = {
  customer?: {
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
  } | null;
};

const CUSTOMER_QUERY = `
  query CustomerAccount {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
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

export async function fetchCustomerAccountProfile(
  accessToken: string,
): Promise<CustomerAccountProfile | null> {
  const { shopDomain, origin } = getCustomerAccountAuthConfig();
  const { graphql_api } = await discoverCustomerAccountApi(shopDomain);

  const response = await fetch(graphql_api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`,
      Origin: origin,
      "User-Agent": "RiseAndBloomStorefront/1.0",
    },
    body: JSON.stringify({ query: CUSTOMER_QUERY }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Customer Account API request failed.");
  }

  const payload = (await response.json()) as {
    data?: CustomerQueryResult;
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length || !payload.data?.customer) {
    return null;
  }

  const customer = payload.data.customer;
  const email = customer.emailAddress?.emailAddress ?? null;
  const firstName = customer.firstName ?? null;
  const lastName = customer.lastName ?? null;

  const orders: CustomerOrderSummary[] = (customer.orders?.edges ?? [])
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

  return {
    id: customer.id,
    firstName,
    lastName,
    email,
    displayName: buildDisplayName(firstName, lastName, email),
    orders,
  };
}
