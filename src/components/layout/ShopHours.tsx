"use client";

import { STORE_HOUR_ROWS } from "@/lib/storeHours";
import { useTranslation } from "@/lib/useTranslation";

type ShopHoursProps = {
  align?: "center" | "start";
  compact?: boolean;
  className?: string;
};

export default function ShopHours({
  align = "start",
  compact = false,
  className = "",
}: ShopHoursProps) {
  const { t } = useTranslation();

  const alignClass =
    align === "center" ? "text-center md:text-left" : "text-left";

  return (
    <div className={`${alignClass} ${className}`}>
      <h3
        className={`font-serif font-bold uppercase tracking-[0.2em] text-charcoal/90 ${
          compact
            ? "text-[10px] md:text-xs"
            : "text-xs md:text-sm"
        }`}
      >
        {t.footer_shop_hours}
      </h3>

      <ul
        className={`w-full min-w-0 ${
          compact ? "mt-2 space-y-1 md:mt-4 md:space-y-2.5" : "mt-4 space-y-2.5"
        }`}
      >
        {STORE_HOUR_ROWS.map(({ dayKey, timeKey }) => (
          <li
            key={dayKey}
            className={`flex items-baseline justify-between gap-x-2 sm:gap-x-4 ${
              compact ? "text-[11px] md:text-sm" : "text-sm"
            }`}
          >
            <span className="shrink-0 font-sans text-charcoal/85">
              {t[dayKey]}
            </span>
            <span className="shrink-0 whitespace-nowrap text-right font-sans text-charcoal/70 tabular-nums">
              {t[timeKey]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
