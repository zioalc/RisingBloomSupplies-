"use client";

import Link from "next/link";
import { useState } from "react";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

type FinalSaleCheckoutBlockProps = {
  checkoutUrl: string;
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
  checkoutUrl,
  buttonLabel,
  buttonClassName = "rounded-full bg-rose py-3 text-center text-sm font-medium text-charcoal transition-colors hover:bg-nightview-dark hover:text-charcoal",
}: FinalSaleCheckoutBlockProps) {
  const { t } = useTranslation();
  const [acknowledged, setAcknowledged] = useState(false);

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

      <a
        href={acknowledged ? checkoutUrl : undefined}
        onClick={(event) => {
          if (!acknowledged) {
            event.preventDefault();
          }
        }}
        aria-disabled={!acknowledged}
        className={`relative z-0 inline-flex w-full items-center justify-center ${buttonClassName} ${
          acknowledged ? "" : "pointer-events-none opacity-50"
        }`}
      >
        {buttonLabel}
      </a>
    </div>
  );
}
