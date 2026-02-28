"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Lazy-load the barcode scanner to avoid bundling html5-qrcode (~400KB) on every page
const BarcodeScanner = dynamic(
  () => import("@/components/barcode-scanner").then((mod) => mod.BarcodeScanner),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-square max-w-sm mx-auto bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading scanner...</p>
      </div>
    ),
  }
);

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");

  const handleScan = (barcode: string) => {
    setStatus(`Barcode detected: ${barcode}`);
    router.push(`/items/new?barcode=${encodeURIComponent(barcode)}`);
  };

  const handleError = (error: string) => {
    setStatus(error);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Scan Barcode</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Point your camera at a barcode</CardTitle>
        </CardHeader>
        <CardContent>
          <BarcodeScanner onScan={handleScan} onError={handleError} />
          {status && (
            <p className="mt-3 text-sm text-gray-600 text-center">{status}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
