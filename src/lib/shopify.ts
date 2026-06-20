const SHOPIFY_API_VERSION = "2024-10";

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  images: ShopifyImage[];
  variants?: ShopifyVariant[];
};

export type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
  image: ShopifyImage | null;
};

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
};

type ShopifyFetchResponse<T> = {
  data: T;
  errors?: Array<{ message: string }>;
};

function getShopifyConfig() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error(
      "Missing Shopify environment variables. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local.",
    );
  }

  return { domain, token };
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache",
  tags,
}: ShopifyFetchOptions): Promise<T> {
  const { domain, token } = getShopifyConfig();

  const response = await fetch(
    `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      ...(tags ? { next: { tags } } : {}),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Shopify API request failed: ${response.status} ${response.statusText}`,
    );
  }

  const json = (await response.json()) as ShopifyFetchResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join(", "));
  }

  return json.data;
}

function mapImage(
  image: ShopifyImage | null | undefined,
): ShopifyImage | null {
  if (!image?.url) {
    return null;
  }

  return image;
}

function mapImages(
  edges: Array<{ node: ShopifyImage }> | undefined,
): ShopifyImage[] {
  return (
    edges
      ?.map(({ node }) => mapImage(node))
      .filter((image): image is ShopifyImage => image !== null) ?? []
  );
}

export async function getProducts(first: number): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          availableForSale: boolean;
          priceRange: {
            minVariantPrice: ShopifyMoney;
          };
          images: {
            edges: Array<{ node: ShopifyImage }>;
          };
          variants: {
            edges: Array<{ node: ShopifyVariant }>;
          };
        };
      }>;
    };
  }>({
    query: `
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { first },
    tags: ["products"],
  });

  return data.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    availableForSale: node.availableForSale,
    priceRange: node.priceRange,
    images: mapImages(node.images.edges),
    variants: node.variants.edges.map(({ node: variant }) => variant),
  }));
}

export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{
    product: {
      id: string;
      title: string;
      handle: string;
      description: string;
      availableForSale: boolean;
      priceRange: {
        minVariantPrice: ShopifyMoney;
      };
      images: {
        edges: Array<{ node: ShopifyImage }>;
      };
      variants: {
        edges: Array<{ node: ShopifyVariant }>;
      };
    } | null;
  }>({
    query: `
      query getProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `,
    variables: { handle },
    tags: [`product-${handle}`],
  });

  if (!data.product) {
    return null;
  }

  const { product } = data;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    availableForSale: product.availableForSale,
    priceRange: product.priceRange,
    images: mapImages(product.images.edges),
    variants: product.variants.edges.map(({ node }) => node),
  };
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{
    collections: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          image: ShopifyImage | null;
        };
      }>;
    };
  }>({
    query: `
      query getCollections {
        collections(first: 20) {
          edges {
            node {
              id
              title
              handle
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    `,
    tags: ["collections"],
  });

  return data.collections.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    image: mapImage(node.image),
  }));
}
