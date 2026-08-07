"use client";

import DiscountPromo from "@/components/promotions/DiscountPromo";
import { localizedPath } from "@/lib/i18n";
import { PROMOTIONS } from "@/lib/promotions";
import { useTranslation } from "@/lib/useTranslation";

export default function WelcomePromoSection() {
  const { t, locale } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-warm-white to-[#f7f0f3] py-10 md:py-12">
      <div className="site-container">
        <DiscountPromo
          variant="card"
          visibility="public"
          title={t.promo_welcome_title}
          description={t.promo_welcome_body.replace(
            "{code}",
            PROMOTIONS.welcome2026.code,
          )}
          code={PROMOTIONS.welcome2026.code}
          ctaLabel={t.promo_shop_now}
          ctaHref={localizedPath(locale, "/shop")}
          termsNote={t.promo_welcome_terms_note}
        />
      </div>
    </section>
  );
}
