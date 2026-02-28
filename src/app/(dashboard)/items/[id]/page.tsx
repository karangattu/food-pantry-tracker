"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExpiryBadge } from "@/components/expiry-badge";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { formatExpirationDate } from "@/lib/expiry-utils";

interface ItemDetail {
  id: number;
  barcode: string | null;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  imageData: string | null;
  quantity: number;
  unit: string | null;
  categoryName: string | null;
  locationName: string | null;
  expirationDate: string | null;
  notes: string | null;
  createdAt: string;
}

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((r) => r.json())
      .then(setItem)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/items");
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />;
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Item not found</p>
        <Link href="/items" className="text-green-600 hover:text-green-500 text-sm mt-2 inline-block">
          Back to inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/items" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
        <div className="flex gap-2">
          <Link href={`/items/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              {(item.imageData || item.imageUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageData || item.imageUrl || ""}
                  alt={item.name}
                  className="h-40 w-40 rounded-lg object-contain"
                />
              ) : (
                <div className="h-40 w-40 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-500" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{item.name}</h1>
                {item.brand && <p className="text-gray-600">{item.brand}</p>}
              </div>

              <ExpiryBadge expirationDate={item.expirationDate} />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Quantity</span>
                  <p className="font-medium text-gray-900">{item.quantity} {item.unit || ""}</p>
                </div>
                {item.categoryName && (
                  <div>
                    <span className="text-gray-600">Category</span>
                    <p className="font-medium text-gray-900">{item.categoryName}</p>
                  </div>
                )}
                {item.locationName && (
                  <div>
                    <span className="text-gray-600">Location</span>
                    <p className="font-medium text-gray-900">{item.locationName}</p>
                  </div>
                )}
                {item.expirationDate && (
                  <div>
                    <span className="text-gray-600">Expiration</span>
                    <p className="font-medium text-gray-900">{formatExpirationDate(item.expirationDate)}</p>
                  </div>
                )}
                {item.barcode && (
                  <div>
                    <span className="text-gray-600">Barcode</span>
                    <p className="font-medium font-mono text-xs text-gray-900">{item.barcode}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Added</span>
                  <p className="font-medium text-gray-900">{item.createdAt}</p>
                </div>
              </div>

              {item.notes && (
                <div>
                  <span className="text-gray-600 text-sm">Notes</span>
                  <p className="text-sm mt-1 text-gray-900">{item.notes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete &quot;{item.name}&quot;? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
