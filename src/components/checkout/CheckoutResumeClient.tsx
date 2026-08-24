"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/lib/cartContext";
import { localizedPath } from "@/lib/i18n";
import {
  clearPendingCheckout,
  readPendingCheckout,
  type PendingCheckoutPayload,
} from "@/lib/pendingCheckout";
import { useTranslation } from "@/lib/useTranslation";

type ResumeState =
  | { status: "loading" }
  | { status: "missing_cart" }
  | { status: "unauthenticated" }
  | { status: "redirecting" }
  | { status: "error" };

export default function CheckoutResumeClient() {
  const { t, locale } = useTranslation();
  const { openDrawer } = useCart();
  const [state, setState] = useState<ResumeState>({ status: "loading" });
  const [retryKey, setRetryKey] = useState(0);

  const shopHref = localizedPath(locale, "/shop");
  const signInHref = `/api/auth/login?locale=${locale}&returnTo=${encodeURIComponent(
    localizedPath(locale, "/checkout-resume"),
  )}`;

  const startCheckoutWithLines = useCallback(
    async (payload: PendingCheckoutPayload, signal: AbortSignal) => {
      setState({ status: "loading" });

      try {
        const sessionResponse = await fetch("/api/auth/session", {
          credentials: "same-origin",
          cache: "no-store",
          signal,
        });
        if (signal.aborted) return;

        const session = sessionResponse.ok
          ? ((await sessionResponse.json()) as { authenticated?: boolean })
          : null;

        if (!session?.authenticated) {
          setState({ status: "unauthenticated" });
          return;
        }

        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: payload.lines, locale: payload.locale }),
          signal,
        });
        if (signal.aborted) return;

        const result = (await response.json()) as { checkoutUrl?: string };
        if (!response.ok || !result.checkoutUrl) {
          throw new Error("Checkout unavailable");
        }

        clearPendingCheckout();
        if (signal.aborted) return;

        setState({ status: "redirecting" });
        window.location.assign(result.checkoutUrl);
      } catch (error) {
        if (signal.aborted) return;
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setState({ status: "error" });
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    const pending = readPendingCheckout();

    if (!pending) {
      setState({ status: "missing_cart" });
      return () => controller.abort();
    }

    void startCheckoutWithLines(pending, controller.signal);
    return () => controller.abort();
  }, [retryKey, startCheckoutWithLines]);

  const handleRetry = () => {
    setState({ status: "loading" });
    setRetryKey((value) => value + 1);
  };

  const handleReturnToCart = () => {
    openDrawer();
  };

  if (state.status === "loading" || state.status === "redirecting") {
    return (
      <p className="font-sans text-sm text-soft-brown md:text-base">
        {t.checkout_resume_preparing}
      </p>
    );
  }

  if (state.status === "missing_cart") {
    return (
      <div className="max-w-lg space-y-4">
        <p className="font-sans text-sm leading-relaxed text-charcoal/80 md:text-base">
          {t.checkout_resume_missing_cart}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleReturnToCart}
            className="rounded-full bg-rose px-5 py-2.5 text-sm text-charcoal transition-colors hover:bg-nightview-dark"
          >
            {t.checkout_resume_return_cart}
          </button>
          <Link
            href={shopHref}
            className="rounded-full border border-charcoal/20 px-5 py-2.5 text-center text-sm text-charcoal transition-colors hover:border-charcoal/40"
          >
            {t.checkout_resume_continue_shopping}
          </Link>
        </div>
      </div>
    );
  }

  if (state.status === "unauthenticated") {
    return (
      <div className="max-w-lg space-y-4">
        <p className="font-sans text-sm leading-relaxed text-charcoal/80 md:text-base">
          {t.checkout_resume_not_signed_in}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={signInHref}
            className="rounded-full bg-rose px-5 py-2.5 text-center text-sm text-charcoal transition-colors hover:bg-nightview-dark"
          >
            {t.checkout_resume_sign_in}
          </a>
          <button
            type="button"
            onClick={handleReturnToCart}
            className="rounded-full border border-charcoal/20 px-5 py-2.5 text-sm text-charcoal transition-colors hover:border-charcoal/40"
          >
            {t.checkout_resume_return_cart}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-4">
      <p className="font-sans text-sm leading-relaxed text-charcoal/80 md:text-base">
        {t.checkout_resume_error}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleRetry}
          className="rounded-full bg-rose px-5 py-2.5 text-sm text-charcoal transition-colors hover:bg-nightview-dark"
        >
          {t.checkout_resume_retry}
        </button>
        <button
          type="button"
          onClick={handleReturnToCart}
          className="rounded-full border border-charcoal/20 px-5 py-2.5 text-sm text-charcoal transition-colors hover:border-charcoal/40"
        >
          {t.checkout_resume_return_cart}
        </button>
      </div>
    </div>
  );
}
