"use client";

import { getExpiryStatus, getExpiryColor, getExpiryLabel } from "@/lib/expiry-utils";

interface ExpiryBadgeProps {
  expirationDate: string | null;
}

export function ExpiryBadge({ expirationDate }: ExpiryBadgeProps) {
  const status = getExpiryStatus(expirationDate);
  const color = getExpiryColor(status);
  const label = getExpiryLabel(expirationDate);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}
