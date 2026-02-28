"use client";

import { useServiceWorkerUpdate } from "@/hooks/use-sw-update";
import { RefreshCw } from "lucide-react";

export function UpdateBanner() {
  const { updateAvailable, applyUpdate } = useServiceWorkerUpdate();

  if (!updateAvailable) return null;

  return (
    <div className="bg-green-600 text-white px-4 py-2 text-sm flex items-center justify-between">
      <span>A new version is available.</span>
      <button
        onClick={applyUpdate}
        className="flex items-center gap-1 rounded-md bg-white/20 px-3 py-1 text-sm font-medium hover:bg-white/30 transition-colors"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Update
      </button>
    </div>
  );
}
