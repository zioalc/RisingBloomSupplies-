"use client";

import Image from "next/image";
import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import ProductModal from "@/components/ui/ProductModal";
import ProductPrice from "@/components/ui/ProductPrice";
import { localizedProductCategory } from "@/lib/localizedProductCategory";
import type { ProductViewData } from "@/lib/products";
import { useTranslation } from "@/lib/useTranslation";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { t, locale } = useTranslation();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductViewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductViewData | null>(null);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !selectedProduct) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, selectedProduct]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setError(false);
      setLoading(false);
      setSelectedProduct(null);
    }
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setError(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&locale=${encodeURIComponent(locale)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = (await response.json()) as {
          products: ProductViewData[];
        };
        setResults(data.products ?? []);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setResults([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, locale]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[85] flex flex-col bg-warm-white/97 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label={t.search_title}
      >
        <div className="border-b border-champagne/70 bg-warm-white">
          <div className="site-container flex items-center gap-2 py-3 md:gap-3 md:py-4">
            <Search
              className="h-5 w-5 shrink-0 text-charcoal/50"
              strokeWidth={1.5}
              aria-hidden
            />
            <label htmlFor={inputId} className="sr-only">
              {t.search_title}
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search_placeholder}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-sans text-base text-charcoal placeholder:text-charcoal/40 focus:outline-none md:text-lg"
            />
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-charcoal transition-colors hover:text-mauve"
              aria-label={t.search_close}
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="site-container py-4 md:py-6">
            {loading ? (
              <p className="text-center text-sm text-soft-brown md:text-base">
                {t.search_loading}
              </p>
            ) : null}

            {error ? (
              <p className="text-center text-sm text-soft-brown md:text-base">
                {t.search_error}
              </p>
            ) : null}

            {!loading &&
            !error &&
            query.trim().length > 0 &&
            results.length === 0 ? (
              <p className="text-center text-sm text-soft-brown md:text-base">
                {t.search_empty}
              </p>
            ) : null}

            {results.length > 0 ? (
              <ul className="divide-y divide-champagne/60" role="listbox">
                {results.map((product) => {
                  const image =
                    product.coverImage ?? product.images[0] ?? null;
                  const categoryLabel = localizedProductCategory(product, t);

                  return (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-[#faf4f7] md:gap-5 md:py-4"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-champagne/40 md:h-20 md:w-20">
                          {image ? (
                            <Image
                              src={image}
                              alt={product.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-sans text-sm font-medium text-charcoal md:text-base">
                            {product.title}
                          </p>
                          {categoryLabel ? (
                            <p className="mt-0.5 text-xs uppercase tracking-wide text-soft-brown">
                              {categoryLabel}
                            </p>
                          ) : null}
                          <ProductPrice
                            className="mt-1"
                            price={product.price}
                            compareAtPrice={product.compareAtPrice}
                            size="card"
                            align="left"
                          />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
