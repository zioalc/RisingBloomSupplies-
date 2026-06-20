"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  initialIndex?: number;
};

export default function ProductGallery({
  images,
  alt,
  initialIndex = 0,
}: ProductGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const hasMultiple = images.length > 1;

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const clamped = Math.max(0, Math.min(index, images.length - 1));
    const slide = container.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveIndex(clamped);
  }, [images.length]);

  useEffect(() => {
    if (initialIndex > 0) {
      scrollToIndex(initialIndex);
    }
  }, [initialIndex, scrollToIndex]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !hasMultiple) return;

    const { scrollLeft, offsetWidth } = container;
    const index = Math.round(scrollLeft / offsetWidth);
    setActiveIndex(Math.max(0, Math.min(index, images.length - 1)));
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-xl bg-warm-white" aria-hidden />
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex aspect-square snap-x snap-mandatory overflow-hidden scroll-smooth rounded-xl bg-warm-white scrollbar-hide"
      >
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative h-full min-w-full shrink-0 snap-center snap-always"
          >
            <Image
              src={src}
              alt={`${alt} — photo ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-warm-white/90 p-2 text-charcoal shadow-md transition-opacity disabled:opacity-0"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === images.length - 1}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-warm-white/90 p-2 text-charcoal shadow-md transition-opacity disabled:opacity-0"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-6 bg-mauve"
                    : "w-2 bg-warm-white/80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
