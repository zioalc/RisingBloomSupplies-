"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CustomerAccountProfile } from "@/lib/auth/customer-api";
import { localizedOrderFinancialStatus } from "@/lib/accountOrderStatus";
import { formatPrice } from "@/lib/utils";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

type AccountClientProps = {
  authQuery?: string | null;
};

type LoadState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "expired" }
  | { status: "error" }
  | { status: "authenticated"; profile: CustomerAccountProfile };

export default function AccountClient({ authQuery }: AccountClientProps) {
  const { locale, t } = useTranslation();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const accountPath = localizedPath(locale, "/account");
  const loginHref = `/api/auth/login?locale=${locale}&returnTo=${encodeURIComponent(accountPath)}`;
  const logoutHref = `/api/auth/logout?locale=${locale}`;
  const shopHref = localizedPath(locale, "/shop");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/account", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!response.ok) {
          if (!cancelled) setState({ status: "error" });
          return;
        }
        const data = (await response.json()) as {
          status: string;
          profile?: CustomerAccountProfile;
        };
        if (cancelled) return;

        if (data.status === "authenticated" && data.profile) {
          setState({ status: "authenticated", profile: data.profile });
        } else if (data.status === "expired") {
          setState({ status: "expired" });
        } else if (data.status === "error") {
          setState({ status: "error" });
        } else {
          setState({ status: "unauthenticated" });
        }
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <p className="text-sm text-soft-brown md:text-base">{t.account_loading}</p>
    );
  }

  if (state.status === "unauthenticated") {
    return (
      <div className="max-w-xl">
        {authQuery === "denied" ? (
          <p className="mb-4 text-sm text-soft-brown">{t.account_auth_denied}</p>
        ) : null}
        {authQuery === "error" ? (
          <p className="mb-4 text-sm text-soft-brown">{t.account_auth_error}</p>
        ) : null}
        <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
          {t.account_guest_title}
        </h2>
        <p className="mt-3 text-sm text-soft-brown md:text-base">
          {t.account_guest_message}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={loginHref}
            className="inline-flex min-h-11 items-center justify-center bg-charcoal px-5 text-xs uppercase tracking-[0.16em] text-warm-white transition-colors hover:bg-mauve"
          >
            {t.account_sign_in}
          </a>
          <Link
            href={shopHref}
            className="inline-flex min-h-11 items-center justify-center border border-charcoal/20 px-5 text-xs uppercase tracking-[0.16em] text-charcoal transition-colors hover:border-mauve hover:text-mauve"
          >
            {t.account_continue_shopping}
          </Link>
        </div>
      </div>
    );
  }

  if (state.status === "expired") {
    return (
      <div className="max-w-xl">
        <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
          {t.account_expired_title}
        </h2>
        <p className="mt-3 text-sm text-soft-brown md:text-base">
          {t.account_expired_message}
        </p>
        <a
          href={loginHref}
          className="mt-6 inline-flex min-h-11 items-center justify-center bg-charcoal px-5 text-xs uppercase tracking-[0.16em] text-warm-white transition-colors hover:bg-mauve"
        >
          {t.account_sign_in_again}
        </a>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="max-w-xl">
        <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
          {t.account_error_title}
        </h2>
        <p className="mt-3 text-sm text-soft-brown md:text-base">
          {t.account_error_message}
        </p>
        <a
          href={loginHref}
          className="mt-6 inline-flex min-h-11 items-center justify-center bg-charcoal px-5 text-xs uppercase tracking-[0.16em] text-warm-white transition-colors hover:bg-mauve"
        >
          {t.account_sign_in}
        </a>
      </div>
    );
  }

  const { profile } = state;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-charcoal/50">
            {t.account_signed_in_as}
          </p>
          <h2 className="mt-1 font-serif text-2xl text-charcoal md:text-3xl">
            {profile.displayName === "Account"
              ? t.nav_account
              : profile.displayName}
          </h2>
          {profile.email ? (
            <p className="mt-2 text-sm text-soft-brown">{profile.email}</p>
          ) : null}
        </div>
        <a
          href={logoutHref}
          className="inline-flex min-h-11 items-center justify-center border border-charcoal/20 px-5 text-xs uppercase tracking-[0.16em] text-charcoal transition-colors hover:border-mauve hover:text-mauve"
        >
          {t.account_sign_out}
        </a>
      </div>

      <section>
        <h3 className="font-sans text-sm uppercase tracking-[0.16em] text-charcoal">
          {t.account_orders_heading}
        </h3>
        <div className="mt-4">
          {profile.orders.length === 0 ? (
            <div className="border border-nightview-light/60 bg-warm-white/50 px-5 py-8">
              <p className="font-serif text-xl text-charcoal">
                {t.account_orders_empty_title}
              </p>
              <p className="mt-2 text-sm text-soft-brown">
                {t.account_orders_empty_message}
              </p>
              <Link
                href={shopHref}
                className="mt-5 inline-flex min-h-11 items-center justify-center bg-charcoal px-5 text-xs uppercase tracking-[0.16em] text-warm-white transition-colors hover:bg-mauve"
              >
                {t.account_continue_shopping}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-nightview-light/50 border border-nightview-light/60">
              {profile.orders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-4"
                >
                  <div>
                    <p className="font-medium text-charcoal">
                      {order.name === "Order"
                        ? t.account_order_fallback
                        : order.name}
                    </p>
                    {order.processedAt ? (
                      <p className="mt-1 text-xs text-soft-brown">
                        {new Date(order.processedAt).toLocaleDateString(
                          locale === "es" ? "es-US" : "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    ) : null}
                    {order.financialStatus ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-charcoal/50">
                        {localizedOrderFinancialStatus(
                          order.financialStatus,
                          t,
                        )}
                      </p>
                    ) : null}
                  </div>
                  {order.totalPrice ? (
                    <p className="text-sm text-charcoal">
                      {formatPrice(
                        order.totalPrice.amount,
                        order.totalPrice.currencyCode,
                        locale,
                      )}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
