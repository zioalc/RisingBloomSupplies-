import type { Locale } from "@/lib/i18n";

const SHOPIFY_API_VERSION = "2024-10";

/** Shopify Storefront API LanguageCode values used by @inContext. */
export type ShopifyLanguageCode = "EN" | "ES";

export function localeToShopifyLanguage(locale: Locale): ShopifyLanguageCode {
  return locale === "es" ? "ES" : "EN";
}

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
  compareAtPrice: ShopifyMoney | null;
};

export type ShopifySeo = {
  title: string | null;
  description: string | null;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  productType?: string;
  tags?: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  images: ShopifyImage[];
  variants?: ShopifyVariant[];
  collections?: Array<{ handle: string; title: string }>;
  seo?: ShopifySeo;
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

const PRODUCT_CARD_FIELDS = `
  id
  title
  handle
  description
  descriptionHtml
  productType
  tags
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
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
  collections(first: 10) {
    edges {
      node {
        handle
        title
      }
    }
  }
`;

const PRODUCT_DETAIL_FIELDS = `
  id
  title
  handle
  description
  descriptionHtml
  productType
  tags
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
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
  collections(first: 10) {
    edges {
      node {
        handle
        title
      }
    }
  }
  seo {
    title
    description
  }
`;

type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  productType: string;
  tags: string[];
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
  collections: {
    edges: Array<{
      node: { handle: string; title: string };
    }>;
  };
  seo?: ShopifySeo;
};

function mapProductNode(node: ShopifyProductNode): ShopifyProduct {
  const description =
    node.descriptionHtml?.trim() || node.description?.trim() || undefined;

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description,
    productType: node.productType,
    tags: node.tags,
    availableForSale: node.availableForSale,
    priceRange: node.priceRange,
    images: mapImages(node.images.edges),
    variants: node.variants.edges.map(({ node: variant }) => variant),
    collections: node.collections.edges.map(({ node: collection }) => ({
      handle: collection.handle,
      title: collection.title,
    })),
    seo: node.seo,
  };
}

function productCacheTags(language: ShopifyLanguageCode, extra: string[] = []) {
  return ["products", `products-${language}`, ...extra];
}

export async function getProducts(
  first: number,
  language: ShopifyLanguageCode,
): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: {
      edges: Array<{ node: ShopifyProductNode }>;
    };
  }>({
    query: `
      query getProducts($first: Int!, $language: LanguageCode!) @inContext(language: $language) {
        products(first: $first) {
          edges {
            node {
              ${PRODUCT_CARD_FIELDS}
            }
          }
        }
      }
    `,
    variables: { first, language },
    cache: "no-store",
    tags: productCacheTags(language),
  });

  return data.products.edges.map(({ node }) => mapProductNode(node));
}

export async function searchProducts(
  searchQuery: string,
  language: ShopifyLanguageCode,
  first = 20,
): Promise<ShopifyProduct[]> {
  const trimmed = searchQuery.trim();
  if (!trimmed) return [];

  const data = await shopifyFetch<{
    products: {
      edges: Array<{ node: ShopifyProductNode }>;
    };
  }>({
    query: `
      query searchProducts($first: Int!, $query: String!, $language: LanguageCode!) @inContext(language: $language) {
        products(first: $first, query: $query) {
          edges {
            node {
              ${PRODUCT_CARD_FIELDS}
            }
          }
        }
      }
    `,
    variables: { first, query: trimmed, language },
    cache: "no-store",
    tags: productCacheTags(language, ["search"]),
  });

  return data.products.edges.map(({ node }) => mapProductNode(node));
}

export async function getCollectionProducts(
  handle: string,
  first: number,
  language: ShopifyLanguageCode,
): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    collection: {
      products: {
        edges: Array<{ node: ShopifyProductNode }>;
      };
    } | null;
  }>({
    query: `
      query getCollectionProducts($handle: String!, $first: Int!, $language: LanguageCode!) @inContext(language: $language) {
        collection(handle: $handle) {
          products(first: $first) {
            edges {
              node {
                ${PRODUCT_CARD_FIELDS}
              }
            }
          }
        }
      }
    `,
    variables: { handle, first, language },
    cache: "no-store",
    tags: productCacheTags(language, [`collection-${handle}`]),
  });

  if (!data.collection) {
    return [];
  }

  return data.collection.products.edges.map(({ node }) => mapProductNode(node));
}

/**
 * Resolve products by Storefront GIDs. Missing / unpublished nodes come back null.
 */
export async function getProductsByIds(
  ids: string[],
  language: ShopifyLanguageCode,
): Promise<{ products: ShopifyProduct[]; missingIds: string[] }> {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return { products: [], missingIds: [] };
  }

  const data = await shopifyFetch<{
    nodes: Array<ShopifyProductNode | null>;
  }>({
    query: `
      query getProductsByIds($ids: [ID!]!, $language: LanguageCode!) @inContext(language: $language) {
        nodes(ids: $ids) {
          ... on Product {
            ${PRODUCT_CARD_FIELDS}
          }
        }
      }
    `,
    variables: { ids: uniqueIds, language },
    cache: "no-store",
    tags: productCacheTags(language, ["wishlist"]),
  });

  const products: ShopifyProduct[] = [];
  const missingIds: string[] = [];

  uniqueIds.forEach((id, index) => {
    const node = data.nodes[index];
    if (node && typeof node.id === "string" && node.handle) {
      products.push(mapProductNode(node));
    } else {
      missingIds.push(id);
    }
  });

  return { products, missingIds };
}

export async function getProductByHandle(
  handle: string,
  language: ShopifyLanguageCode,
): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{
    product: ShopifyProductNode | null;
  }>({
    query: `
      query getProductByHandle($handle: String!, $language: LanguageCode!) @inContext(language: $language) {
        product(handle: $handle) {
          ${PRODUCT_DETAIL_FIELDS}
        }
      }
    `,
    variables: { handle, language },
    tags: productCacheTags(language, [`product-${handle}`]),
  });

  if (!data.product) {
    return null;
  }

  return mapProductNode(data.product);
}

export async function getCollections(
  language: ShopifyLanguageCode,
): Promise<ShopifyCollection[]> {
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
      query getCollections($language: LanguageCode!) @inContext(language: $language) {
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
    variables: { language },
    tags: ["collections", `collections-${language}`],
  });

  return data.collections.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    image: mapImage(node.image),
  }));
}
