"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { localizedPath } from "@/lib/i18n";
import type { PromoVisibility } from "@/lib/promotions";
import { useTranslation } from "@/lib/useTranslation";

export type DiscountPromoProps = {
  title: string;
  description: string;
  code: string;
  /** Primary CTA label */
  ctaLabel: string;
  /** Primary CTA href (localized path or absolute) */
  ctaHref: string;
  /** Where this offer is intended to appear (for reuse / auditing) */
  visibility?: PromoVisibility;
  /** Optional terms footnote under the card */
  termsNote?: string;
  /** Show link to /promotion-terms */
  showTermsLink?: boolean;
  /** Allow copying the code (default true) */
  copyable?: boolean;
  /** Visual density */
  variant?: "card" | "banner" | "compact";
  className?: string;
};

export default function DiscountPromo({
  title,
  description,
  code,
  ctaLabel,
  ctaHref,
  visibility = "public",
  termsNote,
  showTermsLink = true,
  copyable = true,
  variant = "card",
  className = "",
}: DiscountPromoProps) {
  const { t, locale } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shellClass =
    variant === "banner"
      ? "border-y border-champagne/70 bg-gradient-to-b from-warm-white to-[#f7f0f3] px-4 py-10 md:py-12"
      : variant === "compact"
        ? "rounded-2xl border border-champagne/80 bg-warm-white/90 px-5 py-6 md:px-6 md:py-7"
        : "rounded-2xl border border-champagne/80 bg-warm-white/95 px-6 py-8 shadow-sm shadow-mauve/5 md:px-8 md:py-10";

  return (
    <div
      className={`${shellClass} ${className}`}
      data-promo-visibility={visibility}
    >
      <div className={variant === "banner" ? "site-container max-w-3xl text-center" : "mx-auto max-w-xl text-center"}>
        <h2 className="font-sans text-lg font-medium uppercase tracking-[0.2em] text-charcoal md:text-xl md:tracking-[0.22em]">
          {title}
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-soft-brown md:text-base">
          {description}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {copyable ? (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-charcoal/80 bg-transparent px-6 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-charcoal transition-colors hover:border-rose hover:bg-rose/15"
              aria-label={`${t.promo_copy_code}: ${code}`}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              ) : (
                <Copy className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              )}
              <span className="font-mono tracking-[0.12em]">{code}</span>
            </button>
          ) : (
            <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-champagne bg-cream/60 px-6 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-charcoal">
              {code}
            </span>
          )}

          <Link
            href={ctaHref}
            className="inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-full bg-rose px-7 py-2.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-charcoal transition-colors hover:bg-nightview-dark"
          >
            {ctaLabel}
          </Link>
        </div>

        <p className="sr-only" aria-live="polite">
          {copied ? t.promo_code_copied.replace("{code}", code) : ""}
        </p>
        {copied ? (
          <p className="mt-3 font-sans text-xs text-mauve" aria-hidden>
            {t.promo_code_copied.replace("{code}", code)}
          </p>
        ) : (
          <p className="mt-3 font-sans text-xs text-charcoal/55">
            {t.promo_enter_at_checkout}
          </p>
        )}

        {termsNote ? (
          <p className="mt-4 font-sans text-xs leading-relaxed text-charcoal/60">
            {termsNote}
          </p>
        ) : null}

        {showTermsLink ? (
          <p className="mt-3">
            <Link
              href={localizedPath(locale, "/promotion-terms")}
              className="font-sans text-[0.7rem] uppercase tracking-[0.14em] text-charcoal/50 underline-offset-4 transition-colors hover:text-mauve hover:underline"
            >
              {t.promo_terms_link}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
