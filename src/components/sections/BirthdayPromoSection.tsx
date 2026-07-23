"use client";

import DiscountPromo from "@/components/promotions/DiscountPromo";
import { localizedPath } from "@/lib/i18n";
import { PROMOTIONS } from "@/lib/promotions";
import { useTranslation } from "@/lib/useTranslation";

export default function BirthdayPromoSection() {
  const { t, locale } = useTranslation();

  return (
    <section className="border-t border-champagne/50 bg-warm-white py-10 md:py-12">
      <div className="site-container">
        <DiscountPromo
          variant="compact"
          visibility="birthday"
          title={t.promo_birthday_title}
          description={t.promo_birthday_body}
          code={PROMOTIONS.bloombday.code}
          ctaLabel={t.promo_shop_now}
          ctaHref={localizedPath(locale, "/shop")}
          termsNote={t.promo_birthday_terms_note}
        />
      </div>
    </section>
  );
}
