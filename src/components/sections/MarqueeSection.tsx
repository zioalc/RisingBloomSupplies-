"use client";

import { useMemo } from "react";
import { useTranslation } from "@/lib/useTranslation";

const CYCLES_PER_STRIP = 12;

function buildMarqueeLine(items: string[]) {
  const cycle = items.map((item) => `✦ ${item}`).join("   ");
  return Array.from({ length: CYCLES_PER_STRIP }, () => cycle).join("   ");
}

export default function MarqueeSection() {
  const { t } = useTranslation();

  const marqueeLine = useMemo(() => {
    const items = t.marquee_text
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    return buildMarqueeLine(items);
  }, [t.marquee_text]);

  return (
    <div className="marquee-banner overflow-hidden py-0.5">
      <div className="marquee-track flex w-max items-center">
        <span className="shrink-0 whitespace-nowrap px-4 font-display text-[11px] uppercase leading-tight tracking-[0.12em] text-charcoal md:text-xs">
          {marqueeLine}
        </span>
        <span
          className="shrink-0 whitespace-nowrap px-4 font-display text-[11px] uppercase leading-tight tracking-[0.12em] text-charcoal md:text-xs"
          aria-hidden
        >
          {marqueeLine}
        </span>
      </div>
    </div>
  );
}
