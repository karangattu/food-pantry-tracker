"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, StopCircle, Keyboard } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
}

export function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const scannerRef = useRef<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const readerElRef = useRef<HTMLDivElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [showManual, setShowManual] = useState(false);

  // Create a standalone DOM element for html5-qrcode so React never touches it
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const el = document.createElement("div");
    el.id = "barcode-reader";
    container.appendChild(el);
    readerElRef.current = el;
    return () => {
      // Remove the element we created on unmount
      if (container.contains(el)) {
        container.removeChild(el);
      }
      readerElRef.current = null;
    };
  }, []);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const scanner = scannerRef.current as any;
        if (scanner.isScanning) {
          await scanner.stop();
        }
        scanner.clear();
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScanning = useCallback(async () => {
    // Make sure any previous instance is cleaned up
    await stopScanning();

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        () => {
          // ignore intermediate scan failures
        }
      );
      setIsScanning(true);
    } catch {
      onError?.("Camera access denied or unavailable. Try manual entry.");
      setShowManual(true);
    }
  }, [onScan, onError, stopScanning]);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Camera scanner area */}
      <div className="relative">
        <div
          ref={containerRef}
          className="rounded-lg overflow-hidden bg-gray-900 min-h-[200px] flex items-center justify-center"
        >
          {!isScanning && (
            <div className="text-center p-6">
              <Camera className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">Camera preview will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isScanning ? (
          <Button onClick={startScanning} className="flex-1">
            <Camera className="h-4 w-4 mr-2" />
            Start Scanner
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="outline" className="flex-1">
            <StopCircle className="h-4 w-4 mr-2" />
            Stop Scanner
          </Button>
        )}
        <Button
          onClick={() => setShowManual(!showManual)}
          variant="outline"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </div>

      {/* Manual entry fallback */}
      {showManual && (
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <Input
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="Enter barcode number..."
            className="flex-1"
          />
          <Button type="submit" disabled={!manualBarcode.trim()}>
            Look Up
          </Button>
        </form>
      )}
    </div>
  );
}
