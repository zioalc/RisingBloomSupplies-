"use client";

import { STORE_ADDRESS, SOCIAL_LINKS } from "@/lib/contact";
import { useTranslation } from "@/lib/useTranslation";

type StoreLocationProps = {
  align?: "center" | "start";
  compact?: boolean;
  className?: string;
};

export default function StoreLocation({
  align = "start",
  compact = false,
  className = "",
}: StoreLocationProps) {
  const { t } = useTranslation();

  const textSize = compact ? "text-xs" : "text-sm";
  const headingSize = compact
    ? "text-[10px] md:text-[11px]"
    : "text-xs md:text-sm";

  const alignClass =
    align === "center" ? "text-center sm:text-left" : "text-left";

  return (
    <div className={`${alignClass} ${className}`}>
      <h3
        className={`font-serif font-bold uppercase tracking-[0.2em] text-mauve ${headingSize}`}
      >
        {t.footer_store_location}
      </h3>

      <div className={compact ? "mt-3 space-y-2" : "mt-4 space-y-2.5"}>
        <p
          className={`font-serif font-medium leading-snug text-charcoal ${textSize}`}
        >
          {t.footer_store_name}
        </p>

        <address className={`not-italic ${textSize}`}>
          <a
            href={STORE_ADDRESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-sans leading-relaxed text-charcoal/85 transition-colors hover:text-nightview"
          >
            <span className="block">{STORE_ADDRESS.line1}</span>
            <span className="block">
              {STORE_ADDRESS.city}, {STORE_ADDRESS.state} {STORE_ADDRESS.zip}
            </span>
          </a>
        </address>

        <p className={`font-sans text-charcoal/75 ${textSize}`}>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-colors hover:text-nightview"
          >
            @riseandbloom_supplies
          </a>
        </p>

        <p className={`font-sans leading-relaxed text-charcoal/70 ${textSize}`}>
          {t.footer_nail_spa_support}{" "}
          <a
            href={SOCIAL_LINKS.nailSpa}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-charcoal/85 transition-colors hover:text-nightview"
          >
            @riseandbloom_nailsspa
          </a>
        </p>
      </div>
    </div>
  );
}
