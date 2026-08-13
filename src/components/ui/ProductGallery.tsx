"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/lib/useTranslation";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  initialIndex?: number;
};

function LightboxPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function ProductGallery({
  images,
  alt,
  initialIndex = 0,
}: ProductGalleryProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(initialIndex);
  const hasMultiple = images.length > 1;

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container) return;

      const clamped = Math.max(0, Math.min(index, images.length - 1));
      const slide = container.children[clamped] as HTMLElement | undefined;
      slide?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveIndex(clamped);
    },
    [images.length],
  );

  useEffect(() => {
    setActiveIndex(initialIndex);
    setLightboxIndex(initialIndex);
    setLightboxOpen(false);
  }, [alt, initialIndex]);

  useEffect(() => {
    if (initialIndex > 0) {
      scrollToIndex(initialIndex);
    }
  }, [initialIndex, scrollToIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
        return;
      }
      if (!hasMultiple) return;
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => Math.max(0, current - 1));
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          Math.min(images.length - 1, current + 1),
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, hasMultiple, images.length]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !hasMultiple) return;

    const { scrollLeft, offsetWidth } = container;
    const index = Math.round(scrollLeft / offsetWidth);
    setActiveIndex(Math.max(0, Math.min(index, images.length - 1)));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
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
        className="flex aspect-square snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl bg-warm-white scrollbar-hide"
      >
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => openLightbox(index)}
            className="relative h-full min-w-full shrink-0 snap-center snap-always cursor-zoom-in bg-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mauve"
            aria-label={t.aria_view_full_image}
          >
            <Image
              src={src}
              alt={`${alt} — photo ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-2"
              priority={index === 0}
            />
          </button>
        ))}
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-warm-white/90 p-2 text-charcoal shadow-md transition-opacity disabled:opacity-0"
            aria-label={t.aria_previous_image}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === images.length - 1}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-warm-white/90 p-2 text-charcoal shadow-md transition-opacity disabled:opacity-0"
            aria-label={t.aria_next_image}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                className="flex min-h-11 min-w-11 items-center justify-center"
                aria-label={t.aria_go_to_image.replace(
                  "{n}",
                  String(index + 1),
                )}
              >
                <span
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-6 bg-mauve"
                      : "w-2 bg-charcoal/25"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}

      <p className="mt-2 text-center text-xs text-soft-brown">
        {t.gallery_tap_full_hint}
      </p>

      {lightboxOpen ? (
        <LightboxPortal>
          <div
            className="fixed inset-0 z-[120] flex flex-col bg-charcoal/95"
            role="dialog"
            aria-modal="true"
            aria-label={t.aria_view_full_image}
          >
            <div className="flex items-center justify-end px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full bg-warm-white/15 p-2.5 text-warm-white transition-colors hover:bg-warm-white/25"
                aria-label={t.aria_close}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-10"
              onClick={() => setLightboxOpen(false)}
            >
              {/* stopPropagation so tapping the photo doesn’t close */}
              <div
                className="relative z-10 mx-auto h-[min(88dvh,960px)] w-full max-w-5xl"
                onClick={(event) => event.stopPropagation()}
              >
                <Image
                  src={images[lightboxIndex]}
                  alt={`${alt} — photo ${lightboxIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {hasMultiple ? (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setLightboxIndex((current) => Math.max(0, current - 1));
                    }}
                    disabled={lightboxIndex === 0}
                    className="absolute left-2 z-20 rounded-full bg-warm-white/90 p-2 text-charcoal shadow-md transition-opacity disabled:opacity-0 sm:left-4"
                    aria-label={t.aria_previous_image}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setLightboxIndex((current) =>
                        Math.min(images.length - 1, current + 1),
                      );
                    }}
                    disabled={lightboxIndex === images.length - 1}
                    className="absolute right-2 z-20 rounded-full bg-warm-white/90 p-2 text-charcoal shadow-md transition-opacity disabled:opacity-0 sm:right-4"
                    aria-label={t.aria_next_image}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              ) : null}
            </div>

            {hasMultiple ? (
              <p className="pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-xs text-warm-white/70">
                {lightboxIndex + 1} / {images.length}
              </p>
            ) : null}
          </div>
        </LightboxPortal>
      ) : null}
    </div>
  );
}
