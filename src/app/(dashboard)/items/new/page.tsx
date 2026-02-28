"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemForm } from "@/components/item-form";
import { Card, CardContent } from "@/components/ui/card";

function NewItemForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Record<string, string | undefined>>({});
  const [lookingUp, setLookingUp] = useState(false);

  useEffect(() => {
    const barcode = searchParams.get("barcode");
    if (barcode) {
      setLookingUp(true);
      setInitialData({ barcode });
      fetch(`/api/product-lookup?barcode=${encodeURIComponent(barcode)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.found) {
            setInitialData({
              barcode,
              name: data.name,
              brand: data.brand,
              imageUrl: data.imageUrl,
            });
          }
        })
        .catch(() => {})
        .finally(() => setLookingUp(false));
    }
  }, [searchParams]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/items");
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {lookingUp && (
        <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700 mb-4">
          Looking up product information...
        </div>
      )}
      <ItemForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} />
    </>
  );
}

export default function NewItemPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Add Item</h1>
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded" />}>
            <NewItemForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
