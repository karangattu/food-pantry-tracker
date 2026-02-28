"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ItemForm } from "@/components/item-form";
import { Card, CardContent } from "@/components/ui/card";

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((r) => r.json())
      .then(setItem)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push(`/items/${id}`);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />;
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Item not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href={`/items/${id}`} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Edit Item</h1>
      <Card>
        <CardContent className="pt-6">
          <ItemForm
            initialData={{
              barcode: item.barcode as string | undefined,
              name: item.name as string | undefined,
              brand: item.brand as string | undefined,
              imageUrl: item.imageUrl as string | undefined,
              quantity: item.quantity as number | undefined,
              unit: item.unit as string | undefined,
              categoryId: item.categoryId as number | undefined,
              locationId: item.locationId as number | undefined,
              expirationDate: item.expirationDate as string | undefined,
              notes: item.notes as string | undefined,
            }}
            onSubmit={handleSubmit}
            isLoading={saving}
          />
        </CardContent>
      </Card>
    </div>
  );
}
