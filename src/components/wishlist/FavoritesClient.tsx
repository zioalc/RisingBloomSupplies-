"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCatalogRow from "@/components/shop/ProductCatalogRow";
import { localizedPath } from "@/lib/i18n";
import type { ProductViewData } from "@/lib/products";
import { useTranslation } from "@/lib/useTranslation";
import { useWishlist } from "@/lib/wishlistContext";

type ResolveResponse = {
  products: ProductViewData[];
  missingIds?: string[];
  error?: string;
};

export default function FavoritesClient() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { items, isHydrated, removeManyFromWishlist } = useWishlist();
  const [products, setProducts] = useState<ProductViewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const prunedRef = useRef<string>("");
  const shopPath = localizedPath(locale, "/shop");

  const reload = useCallback(() => {
    setReloadToken((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (items.length === 0) {
      router.replace(shopPath);
    }
  }, [isHydrated, items.length, router, shopPath]);

  useEffect(() => {
    if (!isHydrated) return;

    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      setError(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch("/api/wishlist-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, locale }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to resolve wishlist");
        }

        const data = (await response.json()) as ResolveResponse;
        if (cancelled) return;

        const nextProducts = Array.isArray(data.products) ? data.products : [];
        setProducts(nextProducts);

        const missing = Array.isArray(data.missingIds) ? data.missingIds : [];
        if (missing.length > 0) {
          const key = missing.slice().sort().join("|");
          if (prunedRef.current !== key) {
            prunedRef.current = key;
            removeManyFromWishlist(missing);
          }
        }

        if (nextProducts.length === 0 && missing.length === items.length) {
          router.replace(shopPath);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        if (!cancelled) {
          setError(true);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    items,
    isHydrated,
    locale,
    removeManyFromWishlist,
    reloadToken,
    router,
    shopPath,
  ]);

  if (!isHydrated || items.length === 0 || loading) {
    return (
      <p className="py-12 text-center font-sans text-sm text-soft-brown" role="status">
        {t.favorites_loading}
      </p>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[10rem] flex-col items-center justify-center gap-4 py-10 text-center">
        <p className="font-sans text-sm text-soft-brown">{t.favorites_error}</p>
        <button
          type="button"
          onClick={reload}
          className="text-xs uppercase tracking-[0.16em] text-charcoal underline-offset-4 hover:underline"
        >
          {t.favorites_retry}
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-12 text-center font-sans text-sm text-soft-brown" role="status">
        {t.favorites_loading}
      </p>
    );
  }

  return (
    <ProductCatalogRow
      products={products}
      carouselLabel={t.favorites_heading}
      compactTop
    />
  );
}
