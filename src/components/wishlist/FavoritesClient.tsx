"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCatalogRow from "@/components/shop/ProductCatalogRow";
import ProductsEmptyState from "@/components/ui/ProductsEmptyState";
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
  const { t, locale } = useTranslation();
  const { items, isHydrated, removeManyFromWishlist } = useWishlist();
  const [products, setProducts] = useState<ProductViewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [prunedNotice, setPrunedNotice] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const prunedRef = useRef<string>("");

  const reload = useCallback(() => {
    setReloadToken((value) => value + 1);
  }, []);

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

        setProducts(Array.isArray(data.products) ? data.products : []);

        const missing = Array.isArray(data.missingIds) ? data.missingIds : [];
        if (missing.length > 0) {
          const key = missing.slice().sort().join("|");
          if (prunedRef.current !== key) {
            prunedRef.current = key;
            setPrunedNotice(true);
            removeManyFromWishlist(missing);
          }
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
  }, [items, isHydrated, locale, removeManyFromWishlist, reloadToken]);

  if (!isHydrated || loading) {
    return (
      <p className="py-16 text-center font-sans text-sm text-soft-brown" role="status">
        {t.favorites_loading}
      </p>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[12rem] flex-col items-center justify-center px-4 py-12 text-center">
        <p className="max-w-md font-sans text-sm text-soft-brown md:text-base">
          {t.favorites_error}
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reload}
            className="inline-flex min-w-[10.5rem] items-center justify-center rounded-full border border-charcoal/80 bg-transparent px-7 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-charcoal transition-colors hover:border-rose hover:bg-rose"
          >
            {t.favorites_retry}
          </button>
          <a
            href={localizedPath(locale, "/shop")}
            className="inline-flex min-w-[10.5rem] items-center justify-center rounded-full border border-charcoal/80 bg-transparent px-7 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-charcoal transition-colors hover:border-rose hover:bg-rose"
          >
            {t.favorites_shop_cta}
          </a>
        </div>
      </div>
    );
  }

  if (items.length === 0 || products.length === 0) {
    return (
      <ProductsEmptyState
        title={t.favorites_empty_title}
        message={t.favorites_empty_message}
        detail={t.favorites_device_notice}
        actions={[
          {
            href: localizedPath(locale, "/shop"),
            label: t.favorites_shop_cta,
          },
        ]}
      />
    );
  }

  return (
    <div>
      {prunedNotice ? (
        <p
          className="mb-6 rounded-xl border border-champagne/80 bg-warm-white/80 px-4 py-3 font-sans text-sm text-soft-brown"
          role="status"
        >
          {t.favorites_unavailable_notice}
        </p>
      ) : null}

      <ProductCatalogRow
        products={products}
        carouselLabel={t.favorites_heading}
        compactTop
      />
    </div>
  );
}
