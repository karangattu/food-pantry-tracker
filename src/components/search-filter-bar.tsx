"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";
import { cachedFetch } from "@/lib/api-cache";

interface Category {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

interface SearchFilterBarProps {
  categories?: Category[];
  locations?: Location[];
}

export function SearchFilterBar({ categories: propCategories, locations: propLocations }: SearchFilterBarProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [locationId, setLocationId] = useState(searchParams.get("locationId") || "");
  const [expiring, setExpiring] = useState(searchParams.get("expiring") || "");
  const [categories, setCategories] = useState<Category[]>(propCategories || []);
  const [locations, setLocations] = useState<Location[]>(propLocations || []);

  useEffect(() => {
    // Skip fetch if categories/locations were provided as props
    if (!propCategories) {
      cachedFetch<Category[]>("/api/categories").then(setCategories).catch(() => {});
    }
    if (!propLocations) {
      cachedFetch<Location[]>("/api/locations").then(setLocations).catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/items?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("search", search);
  };

  return (
    <div className="space-y-3 mb-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => updateParams("search", search)}
          placeholder="Search items..."
          className="pl-10"
        />
      </form>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            updateParams("categoryId", e.target.value);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>

        <Select
          value={locationId}
          onChange={(e) => {
            setLocationId(e.target.value);
            updateParams("locationId", e.target.value);
          }}
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </Select>

        <Select
          value={expiring}
          onChange={(e) => {
            setExpiring(e.target.value);
            updateParams("expiring", e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="soon">Expiring Soon</option>
          <option value="expired">Expired</option>
        </Select>
      </div>
    </div>
  );
}
