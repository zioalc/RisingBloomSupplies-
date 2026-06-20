"use client";

import { useTranslation } from "@/lib/useTranslation";

export default function MarqueeSection() {
  const { t } = useTranslation();

  return (
    <div
      className="overflow-hidden py-3"
      style={{
        background: "linear-gradient(90deg, #B5606A 0%, #D4869A 100%)",
      }}
    >
      <div className="marquee-track flex w-max">
        <span className="whitespace-nowrap px-4 font-sans text-sm uppercase tracking-[0.25em] text-white">
          {t.marquee_text}
        </span>
        <span
          className="whitespace-nowrap px-4 font-sans text-sm uppercase tracking-[0.25em] text-white"
          aria-hidden
        >
          {t.marquee_text}
        </span>
      </div>
    </div>
  );
}
