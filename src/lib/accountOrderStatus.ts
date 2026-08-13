import type { Translation } from "@/lib/translations/en";

const STATUS_KEYS: Record<string, keyof Translation> = {
  PAID: "account_status_paid",
  PENDING: "account_status_pending",
  AUTHORIZED: "account_status_authorized",
  PARTIALLY_PAID: "account_status_partially_paid",
  PARTIALLY_REFUNDED: "account_status_partially_refunded",
  REFUNDED: "account_status_refunded",
  VOIDED: "account_status_voided",
};

export function localizedOrderFinancialStatus(
  status: string | null | undefined,
  t: Translation,
): string | null {
  if (!status) return null;
  const key = STATUS_KEYS[status.toUpperCase()];
  return key ? t[key] : status;
}
