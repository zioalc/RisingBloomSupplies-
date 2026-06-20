"use client";

import { useTranslation } from "@/lib/useTranslation";

export default function EmailSignupSection() {
  const { t } = useTranslation();

  return (
    <section
      className="section-padding text-center text-white"
      style={{
        background:
          "linear-gradient(135deg, #B5606A 0%, #D4869A 50%, #E8A0AD 100%)",
      }}
    >
      <div className="site-container">
        <div className="site-container-prose mx-auto">
        <h2 className="font-serif text-3xl text-white md:text-4xl lg:text-5xl xl:text-6xl">
          {t.email_heading}
        </h2>
        <p className="mt-3 font-sans text-white/80 md:text-lg lg:text-xl">{t.email_sub}</p>

        <form className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center gap-3 sm:flex-row lg:mt-10">
        <label htmlFor="email-signup" className="sr-only">
          {t.email_address_sr}
        </label>
          <input
            id="email-signup"
            type="email"
            placeholder={t.email_placeholder}
            required
            className="w-full max-w-xs rounded-full border-none bg-warm-white px-6 py-3 font-sans text-sm text-charcoal outline-none placeholder:text-soft-brown sm:flex-1 sm:max-w-none md:py-3.5 md:text-base"
          />
          <button
            type="submit"
            className="rounded-full bg-charcoal px-8 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-[#333333] md:px-10 md:py-3.5 md:text-base"
          >
            {t.email_btn}
          </button>
        </form>
        </div>
      </div>
    </section>
  );
}
