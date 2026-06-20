import type { Metadata } from "next";
import { AtSign, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getTranslation } from "@/lib/translations";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = getTranslation(params.locale);
  return {
    title: t.contact_meta_title,
    description: t.contact_meta_description,
  };
}

export default function ContactPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const t = getTranslation(params.locale);

  return (
    <div className="page-padding bg-cream">
      <div className="site-container site-container-prose text-center">
        <h1 className="font-serif text-3xl text-charcoal md:text-4xl">
          {t.contact_title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal/75">
          {t.contact_intro}
        </p>

        <div className="section-content space-y-4 text-left">
          <div className="rounded-lg bg-warm-white p-6 shadow-sm shadow-mauve/10">
            <h2 className="text-xs uppercase tracking-[0.15em] text-charcoal">
              {t.contact_email_label}
            </h2>
            <a
              href="mailto:hello@risingbloomsupplies.com"
              className="mt-3 flex items-center gap-2 text-sm text-charcoal/75 transition-colors hover:text-mauve"
            >
              <Mail className="h-4 w-4 shrink-0 text-mauve" />
              hello@risingbloomsupplies.com
            </a>
          </div>

          <div className="rounded-lg bg-warm-white p-6 shadow-sm shadow-mauve/10">
            <h2 className="text-xs uppercase tracking-[0.15em] text-charcoal">
              {t.contact_social_label}
            </h2>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-sm text-charcoal/75 transition-colors hover:text-mauve"
            >
              <AtSign className="h-4 w-4 shrink-0 text-mauve" />
              @riseandbloom
            </a>
          </div>

          <div className="rounded-lg bg-warm-white p-6 shadow-sm shadow-mauve/10">
            <h2 className="text-xs uppercase tracking-[0.15em] text-charcoal">
              {t.contact_events_label}
            </h2>
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-charcoal/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mauve" />
              {t.contact_events_body}
            </p>
          </div>
        </div>

        <Link
          href={localizedPath(params.locale, "/shop")}
          className="mt-8 inline-block rounded-full bg-mauve px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal"
        >
          {t.contact_shop_btn}
        </Link>
      </div>
    </div>
  );
}
