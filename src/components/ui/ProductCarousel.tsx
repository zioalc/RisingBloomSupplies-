"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/useTranslation";

type ProductCarouselProps = {
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function ProductCarousel({
  children,
  ariaLabel = "Product carousel",
}: ProductCarouselProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [children, updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("[data-carousel-item]");
    const scrollAmount = card
      ? card.offsetWidth + 24
      : container.clientWidth * 0.85;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="absolute -left-2 top-[38%] z-10 hidden -translate-y-1/2 rounded-full border border-champagne bg-warm-white p-2.5 text-mauve shadow-warm-card transition-all hover:bg-blush disabled:pointer-events-none disabled:opacity-0 md:-left-4 md:flex"
        aria-label={t.aria_scroll_left}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="absolute -right-2 top-[38%] z-10 hidden -translate-y-1/2 rounded-full border border-champagne bg-warm-white p-2.5 text-mauve shadow-warm-card transition-all hover:bg-blush disabled:pointer-events-none disabled:opacity-0 md:-right-4 md:flex"
        aria-label={t.aria_scroll_right}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-[clamp(1rem,2vw,2rem)] overflow-x-auto scroll-smooth pb-2 pt-1 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={ariaLabel}
      >
        {children}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="rounded-full border border-champagne bg-warm-white p-2.5 text-mauve shadow-sm transition-colors hover:bg-blush disabled:opacity-40"
          aria-label={t.aria_scroll_left}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-xs text-soft-brown">{t.carousel_swipe_short}</span>
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="rounded-full border border-champagne bg-warm-white p-2.5 text-mauve shadow-sm transition-colors hover:bg-blush disabled:opacity-40"
          aria-label={t.aria_scroll_right}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
