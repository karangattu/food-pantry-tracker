import { differenceInDays, parseISO, format } from "date-fns";

export type ExpiryStatus = "expired" | "critical" | "warning" | "ok" | "none";

export function getDaysUntilExpiry(expirationDate: string): number {
  const expiry = parseISO(expirationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInDays(expiry, today);
}

export function getExpiryStatus(expirationDate: string | null): ExpiryStatus {
  if (!expirationDate) return "none";
  const days = getDaysUntilExpiry(expirationDate);
  if (days < 0) return "expired";
  if (days <= 2) return "critical";
  if (days <= 7) return "warning";
  return "ok";
}

export function getExpiryColor(status: ExpiryStatus): string {
  switch (status) {
    case "expired":
      return "bg-red-100 text-red-800 border-red-200";
    case "critical":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ok":
      return "bg-green-100 text-green-800 border-green-200";
    case "none":
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export function getExpiryLabel(expirationDate: string | null): string {
  if (!expirationDate) return "No expiry date";
  const days = getDaysUntilExpiry(expirationDate);
  if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} ago`;
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  return `Expires in ${days} days`;
}

export function formatExpirationDate(date: string): string {
  return format(parseISO(date), "MMM d, yyyy");
}
