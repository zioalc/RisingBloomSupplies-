"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

type FinalSaleCheckoutBlockProps = {
  lines: Array<{ variantId: string; quantity: number }>;
  buttonLabel: string;
  buttonClassName?: string;
};

export function FinalSaleCheckoutNotice() {
  const { t, locale } = useTranslation();

  return (
    <p className="font-sans text-xs leading-relaxed text-charcoal/70">
      {t.checkout_final_sale_notice}{" "}
      <Link
        href={localizedPath(locale, "/returns-refund-policy")}
        className="text-brand-pink underline underline-offset-2 transition-colors hover:text-brand-pink"
      >
        {t.footer_link_returns}
      </Link>
      .
    </p>
  );
}

export function FinalSaleCheckoutBlock({
  lines,
  buttonLabel,
  buttonClassName = "rounded-full bg-rose py-3 text-center text-sm font-medium text-charcoal transition-colors hover:bg-nightview-dark hover:text-charcoal",
}: FinalSaleCheckoutBlockProps) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [acknowledged, setAcknowledged] = useState(false);
  const [showGuestChoice, setShowGuestChoice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const startCheckout = async () => {
    setSubmitting(true);
    setError(false);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const result = (await response.json()) as { checkoutUrl?: string };
      if (!response.ok || !result.checkoutUrl) {
        throw new Error("Checkout unavailable");
      }

      window.location.assign(result.checkoutUrl);
    } catch {
      setError(true);
      setSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    if (!acknowledged || submitting) return;

    setSubmitting(true);
    setError(false);
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const session = response.ok
        ? ((await response.json()) as { authenticated?: boolean })
        : null;

      if (session?.authenticated) {
        setSubmitting(false);
        await startCheckout();
        return;
      }

      setShowGuestChoice(true);
      setSubmitting(false);
    } catch {
      setShowGuestChoice(true);
      setSubmitting(false);
    }
  };

  const signInHref = `/api/auth/login?locale=${locale}&returnTo=${encodeURIComponent(
    pathname,
  )}`;

  return (
    <div className="flex flex-col gap-3">
      <FinalSaleCheckoutNotice />

      <label className="flex cursor-pointer items-start gap-2.5 text-left">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(event) => setAcknowledged(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-champagne text-nightview focus:ring-nightview/30"
        />
        <span className="font-sans text-xs leading-relaxed text-charcoal/80">
          {t.checkout_final_sale_acknowledge}
        </span>
      </label>

      <button
        type="button"
        onClick={() => void handleCheckout()}
        disabled={!acknowledged || submitting}
        aria-disabled={!acknowledged}
        className={`relative z-0 inline-flex w-full items-center justify-center ${buttonClassName} ${
          acknowledged && !submitting ? "" : "opacity-50"
        }`}
      >
        {submitting ? t.checkout_loading : buttonLabel}
      </button>

      {showGuestChoice ? (
        <div className="rounded-xl border border-champagne/70 bg-cream/50 p-4 text-center">
          <p className="font-sans text-sm font-medium text-charcoal">
            {t.checkout_account_choice_title}
          </p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-charcoal/65">
            {t.checkout_account_choice_body}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Link
              href={signInHref}
              className="rounded-full border border-charcoal/20 px-4 py-2.5 text-sm text-charcoal transition-colors hover:border-charcoal/40"
            >
              {t.checkout_sign_in}
            </Link>
            <button
              type="button"
              onClick={() => void startCheckout()}
              disabled={submitting}
              className="rounded-full bg-rose px-4 py-2.5 text-sm text-charcoal transition-colors hover:bg-nightview-dark disabled:opacity-50"
            >
              {submitting ? t.checkout_loading : t.checkout_guest}
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="text-center text-xs text-red-700">
          {t.checkout_error}
        </p>
      ) : null}
    </div>
  );
}
