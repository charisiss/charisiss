export function formatMoney(cents: number | null | undefined, currency = "EUR") {
  if (cents === null || cents === undefined) return "—";
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/** Add calendar months to an ISO date (YYYY-MM-DD), noon UTC to avoid DST edge cases. */
export function addMonthsIso(isoDate: string, months: number) {
  const date = new Date(`${isoDate}T12:00:00.000Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

export function eurosToCents(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number.parseFloat(String(value).replace(",", "."));
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export function centsToEuroInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2);
}

export function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
