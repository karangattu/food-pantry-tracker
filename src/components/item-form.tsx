"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";
import Image from "next/image";
import { lookupBarcodeClient } from "@/lib/open-food-facts-client";
import { cachedFetch } from "@/lib/api-cache";

interface Category {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

interface ItemFormProps {
  initialData?: {
    barcode?: string;
    name?: string;
    brand?: string;
    imageUrl?: string;
    quantity?: number;
    unit?: string;
    categoryId?: number;
    locationId?: number;
    expirationDate?: string;
    notes?: string;
  };
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading: boolean;
}

export function ItemForm({ initialData, onSubmit, isLoading }: ItemFormProps) {
  const [barcode, setBarcode] = useState(initialData?.barcode || "");
  const [name, setName] = useState(initialData?.name || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [unit, setUnit] = useState(initialData?.unit || "");
  const [categoryId, setCategoryId] = useState<number | "">(initialData?.categoryId || "");
  const [locationId, setLocationId] = useState<number | "">(initialData?.locationId || "");
  const [expirationDate, setExpirationDate] = useState(initialData?.expirationDate || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [lookingUp, setLookingUp] = useState(false);

  useEffect(() => {
    cachedFetch<Category[]>("/api/categories").then(setCategories).catch(() => {});
    cachedFetch<Location[]>("/api/locations").then(setLocations).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialData) {
      if (initialData.barcode) setBarcode(initialData.barcode);
      if (initialData.name) setName(initialData.name);
      if (initialData.brand) setBrand(initialData.brand);
      if (initialData.imageUrl) setImageUrl(initialData.imageUrl);
      if (initialData.quantity) setQuantity(initialData.quantity);
      if (initialData.unit) setUnit(initialData.unit);
      if (initialData.categoryId) setCategoryId(initialData.categoryId);
      if (initialData.locationId) setLocationId(initialData.locationId);
      if (initialData.expirationDate) setExpirationDate(initialData.expirationDate);
      if (initialData.notes) setNotes(initialData.notes);
    }
  }, [initialData]);

  const handleLookup = async () => {
    if (!barcode.trim()) return;
    setLookingUp(true);
    try {
      const data = await lookupBarcodeClient(barcode);
      if (data.found) {
        if (data.name && !name) setName(data.name);
        if (data.brand && !brand) setBrand(data.brand);
        if (data.imageUrl) setImageUrl(data.imageUrl);
      }
    } catch {
      // ignore
    } finally {
      setLookingUp(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      barcode: barcode || null,
      name,
      brand: brand || null,
      imageUrl: imageUrl || null,
      quantity,
      unit: unit || null,
      categoryId: categoryId || null,
      locationId: locationId || null,
      expirationDate: expirationDate || null,
      notes: notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Barcode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
        <div className="flex gap-2">
          <Input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter or scan barcode..."
          />
          <Button type="button" onClick={handleLookup} disabled={lookingUp || !barcode.trim()} variant="outline">
            <Search className="h-4 w-4 mr-1" />
            {lookingUp ? "..." : "Lookup"}
          </Button>
        </div>
      </div>

      {/* Image preview */}
      {imageUrl && (
        <div className="flex justify-center">
          <Image
            src={imageUrl}
            alt={name || "Product"}
            width={120}
            height={120}
            className="rounded-md object-contain"
            unoptimized
          />
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required />
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
        <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name" />
      </div>

      {/* Quantity + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="cans, boxes, lbs..." />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : "")}>
          <option value="">Select category...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </div>

      {/* Storage Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
        <Select value={locationId} onChange={(e) => setLocationId(e.target.value ? parseInt(e.target.value) : "")}>
          <option value="">Select location...</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </Select>
      </div>

      {/* Expiration Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
        <Input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[80px]"
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading || !name.trim()} className="w-full">
        {isLoading ? "Saving..." : initialData?.name ? "Update Item" : "Add Item"}
      </Button>
    </form>
  );
}
