import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { type Locale } from "@/lib/i18n";
import { getTranslation } from "@/lib/translations";

function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return "en";
  const preferred = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return preferred.startsWith("es") ? "es" : "en";
}

export function generateMetadata(): Metadata {
  const locale = localeFromAcceptLanguage(
    headers().get("accept-language"),
  );
  const t = getTranslation(locale);

  return {
    title: t.coming_soon_meta_title,
    description: t.coming_soon_meta_description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ComingSoonPage() {
  const locale = localeFromAcceptLanguage(
    headers().get("accept-language"),
  );
  const t = getTranslation(locale);

  return (
    <main
      lang={locale}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-warm-white via-[#FFF9FB] to-flower/40 px-6 py-16 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(236,106,166,0.12), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center">
        <Image
          src="/images/rise-bloom-logo.png"
          alt="Rise & Bloom"
          width={320}
          height={100}
          priority
          className="h-14 w-auto object-contain sm:h-16 md:h-20"
        />

        <p className="logo-display mt-4 font-display text-[1.15rem] tracking-[0.08em] text-charcoal sm:text-[1.35rem] md:text-[1.5rem]">
          {t.header_subtitle}
        </p>

        <div className="mt-8 h-px w-14 bg-rose/45" aria-hidden />

        <h1 className="mt-8 font-serif text-3xl font-medium tracking-tight text-charcoal sm:text-4xl md:text-5xl">
          {t.coming_soon_title}
        </h1>

        <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-soft-brown sm:text-base md:text-lg">
          {t.coming_soon_body}
        </p>
      </div>
    </main>
  );
}
