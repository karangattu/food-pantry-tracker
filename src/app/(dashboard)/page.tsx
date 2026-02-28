"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Plus, Package, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBanner } from "@/components/alert-banner";
import { ItemCard } from "@/components/item-card";

interface DashboardItem {
  id: number;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  imageData: string | null;
  quantity: number;
  unit: string | null;
  locationName: string | null;
  expirationDate: string | null;
}

interface AlertItem {
  id: number;
  name: string;
  brand: string | null;
  expirationDate: string | null;
  locationName: string | null;
}

export default function DashboardPage() {
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [expiringCount, setExpiringCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setItems(data.recentItems);
          setTotalCount(data.totalCount);
          setExpiringCount(data.expiringCount);
          setExpiredCount(data.expiredCount);
          setAlerts(data.alerts);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDismissAlert = (itemId: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== itemId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <AlertBanner items={alerts} onDismiss={handleDismissAlert} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium text-gray-600">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-yellow-600">{expiringCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium text-gray-600">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold text-red-600">{expiredCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/scan" className="flex-1">
          <Button className="w-full" size="lg">
            <Camera className="h-5 w-5 mr-2" />
            Scan Item
          </Button>
        </Link>
        <Link href="/items/new" className="flex-1">
          <Button className="w-full" variant="outline" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </Button>
        </Link>
      </div>

      {/* Recent Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Recent Items</h2>
          <Link href="/items" className="text-sm text-green-600 hover:text-green-500">
            View all
          </Link>
        </div>
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-600">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-500" />
              <p>No items yet. Scan or add your first item!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
