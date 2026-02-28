"use client";

import { useState } from "react";
import { useServiceWorkerUpdate } from "@/hooks/use-sw-update";
import { RefreshCw } from "lucide-react";

export function UpdateBanner() {
  const { updateAvailable, applyUpdate } = useServiceWorkerUpdate();
  const [updating, setUpdating] = useState(false);

  if (!updateAvailable) return null;

  const handleUpdate = () => {
    setUpdating(true);
    applyUpdate();
    // Page will reload via controllerchange — spinner shows until then
  };

  return (
    <div className="bg-green-600 text-white px-4 py-2 text-sm flex items-center justify-between">
      <span>{updating ? "Updating…" : "A new version is available."}</span>
      <button
        onClick={handleUpdate}
        disabled={updating}
        className="flex items-center gap-1 rounded-md bg-white/20 px-3 py-1 text-sm font-medium hover:bg-white/30 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${updating ? "animate-spin" : ""}`} />
        {updating ? "Updating…" : "Update"}
      </button>
    </div>
  );
}
