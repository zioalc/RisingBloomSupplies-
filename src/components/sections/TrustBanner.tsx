"use client";

import { MapPin, Truck, Zap } from "lucide-react";
import { TRUST_BANNER_ITEMS } from "@/lib/trustBanner";
import { useTranslation } from "@/lib/useTranslation";

const ICONS = {
  shipping: Truck,
  processing: Zap,
  pickup: MapPin,
} as const;

export default function TrustBanner() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-champagne/60 bg-warm-white">
      <div className="site-container py-10 md:py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {TRUST_BANNER_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];

            return (
              <div
                key={item.id}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-mauve/30 text-mauve">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-serif text-base font-semibold text-charcoal md:text-lg">
                  {t[item.titleKey]}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-soft-brown md:max-w-none">
                  {t[item.bodyKey]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
