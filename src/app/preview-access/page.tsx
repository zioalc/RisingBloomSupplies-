import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PreviewAccessClient from "@/components/preview/PreviewAccessClient";
import {
  hasValidPreviewCookie,
  PREVIEW_COOKIE_NAME,
} from "@/lib/previewAccess";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview Access | Rise & Bloom",
  robots: {
    index: false,
    follow: false,
  },
};

function previewPageEnabled() {
  return (
    process.env.STOREFRONT_PREVIEW_ENABLED === "true" &&
    Boolean(process.env.STOREFRONT_PREVIEW_SECRET?.trim())
  );
}

export default async function PreviewAccessPage() {
  if (!previewPageEnabled()) {
    notFound();
  }

  const token = cookies().get(PREVIEW_COOKIE_NAME)?.value;
  const cookieHeader = token ? `${PREVIEW_COOKIE_NAME}=${token}` : null;
  const probe = new Request("http://localhost/preview-access", {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });
  const initiallyInPreview = await hasValidPreviewCookie(probe);

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-warm-white via-[#FFF9FB] to-flower/40 px-6 py-16 text-center">
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
          className="h-14 w-auto object-contain sm:h-16"
        />

        <h1 className="mt-8 font-serif text-3xl font-medium tracking-tight text-charcoal sm:text-4xl">
          Storefront Preview
        </h1>
        <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-soft-brown">
          Developer access while the public site shows Coming Soon.
        </p>

        <div className="mt-8 w-full">
          <PreviewAccessClient initiallyInPreview={initiallyInPreview} />
        </div>
      </div>
    </main>
  );
}
