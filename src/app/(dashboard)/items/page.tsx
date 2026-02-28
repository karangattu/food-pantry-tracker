"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ItemCard } from "@/components/item-card";
import { SearchFilterBar } from "@/components/search-filter-bar";

interface Item {
  id: number;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  quantity: number;
  unit: string | null;
  locationName: string | null;
  expirationDate: string | null;
}

function ItemsList() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        const res = await fetch(`/api/items?${params.toString()}`);
        if (res.ok) {
          setItems(await res.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-600">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No items found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <ItemCard key={item.id} {...item} />
      ))}
    </div>
  );
}

export default function ItemsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Link href="/items/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </Link>
      </div>
      <Suspense fallback={null}>
        <SearchFilterBar />
        <ItemsList />
      </Suspense>
    </div>
  );
}
