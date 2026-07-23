"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  PROMOTIONS,
  PROMO_ANNOUNCEMENT_BLOOM10_KEY,
  PROMO_ANNOUNCEMENT_INSTORE_KEY,
  PROMO_ANNOUNCEMENT_SHIPPING_KEY,
} from "@/lib/promotions";
import { useTranslation } from "@/lib/useTranslation";

type PromoStep = "bloom10" | "instore" | "shipping" | "hidden";

function readDismissed(key: string) {
  try {
    return Boolean(window.sessionStorage.getItem(key));
  } catch {
    return false;
  }
}

function writeDismissed(key: string) {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    // ignore storage failures
  }
}

export default function PromoAnnouncementBar() {
  const { t } = useTranslation();
  const [step, setStep] = useState<PromoStep>("bloom10");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bloomDismissed = readDismissed(PROMO_ANNOUNCEMENT_BLOOM10_KEY);
    const instoreDismissed = readDismissed(PROMO_ANNOUNCEMENT_INSTORE_KEY);
    const shippingDismissed = readDismissed(PROMO_ANNOUNCEMENT_SHIPPING_KEY);

    if (shippingDismissed) {
      setStep("hidden");
    } else if (instoreDismissed) {
      setStep("shipping");
    } else if (bloomDismissed) {
      setStep("instore");
    } else {
      setStep("bloom10");
    }
    setReady(true);
  }, []);

  const dismiss = () => {
    if (step === "bloom10") {
      writeDismissed(PROMO_ANNOUNCEMENT_BLOOM10_KEY);
      setStep("instore");
      return;
    }

    if (step === "instore") {
      writeDismissed(PROMO_ANNOUNCEMENT_INSTORE_KEY);
      setStep("shipping");
      return;
    }

    if (step === "shipping") {
      writeDismissed(PROMO_ANNOUNCEMENT_SHIPPING_KEY);
      setStep("hidden");
    }
  };

  if (!ready || step === "hidden") return null;

  const message =
    step === "bloom10"
      ? t.promo_announcement_bloom10.replace("{code}", PROMOTIONS.bloom10.code)
      : step === "instore"
        ? t.promo_announcement_instore
        : t.promo_announcement_shipping;

  return (
    <div
      className="relative z-[60] border-b border-rose/20 bg-[#f6eef2] px-10 py-2.5 text-center md:px-14"
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
