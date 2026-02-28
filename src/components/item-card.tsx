"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { ExpiryBadge } from "@/components/expiry-badge";
import Image from "next/image";

interface ItemCardProps {
  id: number;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  quantity: number;
  unit: string | null;
  locationName: string | null;
  expirationDate: string | null;
}

export function ItemCard({
  id,
  name,
  brand,
  imageUrl,
  quantity,
  unit,
  locationName,
  expirationDate,
}: ItemCardProps) {
  return (
    <Link
      href={`/items/${id}`}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-green-200 hover:shadow-sm transition-all"
    >
      {/* Image/Icon */}
      <div className="h-12 w-12 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={48}
            height={48}
            className="object-contain"
            unoptimized
          />
        ) : (
          <Package className="h-6 w-6 text-gray-500" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{name}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {brand && <span className="text-xs text-gray-600 truncate">{brand}</span>}
          <span className="text-xs text-gray-600">
            {quantity} {unit || ""}
          </span>
          {locationName && (
            <span className="text-xs text-gray-600">| {locationName}</span>
          )}
        </div>
      </div>

      {/* Expiry */}
      <div className="flex-shrink-0">
        <ExpiryBadge expirationDate={expirationDate} />
      </div>
    </Link>
  );
}
