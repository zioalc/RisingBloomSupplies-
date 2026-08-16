"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { PROMOTIONS } from "@/lib/promotions";
import { useTranslation } from "@/lib/useTranslation";

type PromoStep = "welcome" | "instore" | "shipping" | "hidden";

export default function PromoAnnouncementBar() {
  const { t } = useTranslation();
  // In-memory only so a page refresh shows the promo messages again.
  const [step, setStep] = useState<PromoStep>("welcome");

  const dismiss = () => {
    if (step === "welcome") {
      setStep("instore");
      return;
    }

    if (step === "instore") {
      setStep("shipping");
      return;
    }

    if (step === "shipping") {
      setStep("hidden");
    }
  };

  if (step === "hidden") return null;

  const message =
    step === "welcome"
      ? t.promo_announcement_welcome.replace(
          "{code}",
          PROMOTIONS.welcome2026.code,
        )
      : step === "instore"
        ? t.promo_announcement_instore
        : t.promo_announcement_shipping;

  return (
    <div
      className="relative z-[60] border-b border-nightview-light/40 bg-warm-white px-10 py-2.5 text-center md:px-14"
      role="region"
      aria-label={t.promo_announcement_aria}
    >
      <p className="mx-auto max-w-3xl font-sans text-[0.7rem] leading-snug tracking-wide text-charcoal/85 md:text-xs">
        {message}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-1/2 flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-md text-charcoal/50 transition-colors hover:bg-white/60 hover:text-charcoal md:right-3"
        aria-label={t.promo_announcement_dismiss}
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
