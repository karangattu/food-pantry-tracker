"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Package, Settings, MapPin, Tag, CookingPot } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/items", label: "Items", icon: Package },
  { href: "/settings", label: "Settings", icon: Settings },
];

const sidebarItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/scan", label: "Scan Barcode", icon: Camera },
  { href: "/items", label: "Inventory", icon: Package },
  { href: "/categories", label: "Categories", icon: Tag },
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center gap-2 px-6 mb-8">
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
              <CookingPot className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Food Pantry</span>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                  isActive(item.href)
                    ? "text-green-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
