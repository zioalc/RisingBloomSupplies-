"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { localizedPath } from "@/lib/i18n";
import { useTranslation } from "@/lib/useTranslation";

type SessionState =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "signed_in" };

type AuthNavControlProps = {
  variant: "header" | "mobile";
  onNavigate?: () => void;
};

export default function AuthNavControl({
  variant,
  onNavigate,
}: AuthNavControlProps) {
  const { locale, t } = useTranslation();
  const [session, setSession] = useState<SessionState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!response.ok) {
          if (!cancelled) setSession({ status: "signed_out" });
          return;
        }
        const data = (await response.json()) as { authenticated?: boolean };
        if (!cancelled) {
          setSession({
            status: data.authenticated ? "signed_in" : "signed_out",
          });
        }
      } catch {
        if (!cancelled) setSession({ status: "signed_out" });
      }
    }

    void loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  // Always land on the custom account page first. Sign In on that page starts
  // /api/auth/login → Shopify hosted OTP → callback → /{locale}/account.
  const accountHref = localizedPath(locale, "/account");
  const label = t.nav_account;
  const href = accountHref;
  const aria = t.aria_account;
  const authenticated = session.status === "signed_in";

  if (variant === "header") {
    return (
      <Link
        href={href}
        className="relative rounded-md p-2 text-charcoal transition-colors hover:text-charcoal/70"
        aria-label={aria}
        title={label}
        data-authenticated={authenticated}
      >
        <User className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex min-h-[3.25rem] w-full items-center justify-between px-4 py-3.5 font-sans text-[0.8rem] uppercase tracking-[0.16em] text-charcoal/80 transition-colors hover:bg-nightview-light/20 hover:text-charcoal"
      aria-label={aria}
      data-authenticated={authenticated}
    >
      <span className="flex items-center gap-2.5">
        <User className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        <span>{label}</span>
      </span>
    </Link>
  );
}
