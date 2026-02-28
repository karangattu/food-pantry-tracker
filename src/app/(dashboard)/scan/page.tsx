"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <h1 className="text-2xl font-bold">Scan Barcode</h1>
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
