export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function timeUntil(targetIso: string): string {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (diff <= 0) {
    return "Cutoff processing";
  }

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}
