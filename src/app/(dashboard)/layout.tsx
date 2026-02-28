"use client";

import { NavBar } from "@/components/nav-bar";
import { UpdateBanner } from "@/components/update-banner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <UpdateBanner />
      <NavBar />
      <main className="pb-20 md:pb-0 md:pl-64">
        <div className="mx-auto max-w-4xl p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
