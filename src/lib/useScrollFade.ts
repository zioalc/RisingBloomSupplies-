"use client";

import { useEffect, useRef, useState } from "react";

type UseScrollFadeOptions = {
  /** Fraction of the element that must be visible (0–1). */
  threshold?: number;
  /** Once visible, stay visible (default true). */
  once?: boolean;
};

/**
 * Soft fade/rise when an element enters the viewport while scrolling.
 * Honors prefers-reduced-motion.
 */
export function useScrollFade<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollFadeOptions = {},
) {
  const { threshold = 0.12, once = true } = options;
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(element);
          return;
        }
        if (!once) setVisible(false);
      },
      {
        threshold,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold]);

  return { ref, visible };
}
