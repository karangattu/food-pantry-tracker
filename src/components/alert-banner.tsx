"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { ExpiryBadge } from "@/components/expiry-badge";

interface AlertItem {
  id: number;
  name: string;
  brand: string | null;
  expirationDate: string | null;
  locationName: string | null;
}

interface AlertBannerProps {
  items: AlertItem[];
  onDismiss: (itemId: number) => void;
}

export function AlertBanner({ items, onDismiss }: AlertBannerProps) {
  const [dismissing, setDismissing] = useState<number | null>(null);

  if (items.length === 0) return null;

  const handleDismiss = async (itemId: number) => {
    setDismissing(itemId);
    try {
      await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      onDismiss(itemId);
    } catch {
      // ignore
    } finally {
      setDismissing(null);
    }
  };

  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        <h3 className="font-semibold text-orange-800">Expiration Alerts</h3>
        <span className="text-sm text-orange-600">({items.length} items)</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white rounded-md border border-orange-100 px-3 py-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-medium text-sm text-gray-900 truncate">{item.name}</span>
              {item.brand && (
                <span className="text-xs text-gray-600 hidden sm:inline">({item.brand})</span>
              )}
              <ExpiryBadge expirationDate={item.expirationDate} />
            </div>
            <button
              onClick={() => handleDismiss(item.id)}
              disabled={dismissing === item.id}
              className="ml-2 p-1 text-gray-600 hover:text-gray-700 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
