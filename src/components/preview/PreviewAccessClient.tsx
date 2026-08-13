"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type PreviewAccessClientProps = {
  initiallyInPreview: boolean;
};

export default function PreviewAccessClient({
  initiallyInPreview,
}: PreviewAccessClientProps) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [inPreview, setInPreview] = useState(initiallyInPreview);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function enterPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(false);

    try {
      const response = await fetch("/api/preview/enter", {
        method: "POST",
        headers: {
          "X-Storefront-Preview-Key": secret,
        },
      });

      // Clear the typed secret from React state immediately after submit.
      setSecret("");

      if (!response.ok) {
        setError(true);
        return;
      }

      setInPreview(true);
      router.replace("/en");
      router.refresh();
    } catch {
      setSecret("");
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function exitPreview() {
    if (submitting) return;

    setSubmitting(true);
    setError(false);

    try {
      await fetch("/api/preview/exit", { method: "POST" });
      setInPreview(false);
      router.replace("/coming-soon");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (inPreview) {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <p className="font-sans text-sm text-soft-brown">
          Preview access is active in this browser.
        </p>
        <button
          type="button"
          onClick={() => void exitPreview()}
          disabled={submitting}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-charcoal/80 bg-transparent px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-charcoal transition-colors hover:border-rose hover:bg-rose disabled:opacity-60"
        >
          {submitting ? "Exiting…" : "Exit Preview"}
        </button>
        {error ? (
          <p className="mt-4 font-sans text-sm text-soft-brown" role="alert">
            Something went wrong. Please try again.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void enterPreview(event)}
      className="mx-auto w-full max-w-sm"
    >
      <label
        htmlFor="preview-secret"
        className="block text-left text-xs uppercase tracking-[0.16em] text-charcoal"
      >
        Preview access key
      </label>
      <input
        id="preview-secret"
        name="preview-secret"
        type="password"
        autoComplete="off"
        value={secret}
        onChange={(event) => {
          setSecret(event.target.value);
          if (error) setError(false);
        }}
        className="mt-2 w-full rounded-lg border border-champagne bg-warm-white px-4 py-3 font-sans text-sm text-charcoal focus:border-mauve focus:outline-none focus:ring-1 focus:ring-mauve"
      />

      <button
        type="submit"
        disabled={submitting || secret.trim().length === 0}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-rose px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-charcoal transition-colors hover:bg-nightview-dark disabled:opacity-60"
      >
        {submitting ? "Checking…" : "Enter Preview"}
      </button>

      {error ? (
        <p className="mt-4 text-center font-sans text-sm text-soft-brown" role="alert">
          Access denied.
        </p>
      ) : null}
    </form>
  );
}
