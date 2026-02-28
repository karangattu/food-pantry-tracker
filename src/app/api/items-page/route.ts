import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items, categories, storageLocations } from "@/db/schema";
import { eq, and, like, or, lte, gte, desc, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { format, addDays } from "date-fns";

/**
 * Consolidated endpoint for the items list page.
 * Returns items (with filters) + categories + locations in a single
 * serverless invocation instead of 3 separate API calls.
 */
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const locationId = searchParams.get("locationId");
    const expiring = searchParams.get("expiring");

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(items.name, `%${search}%`),
          like(items.brand, `%${search}%`)
        )
      );
    }

    if (categoryId) {
      conditions.push(eq(items.categoryId, parseInt(categoryId)));
    }

    if (locationId) {
      conditions.push(eq(items.locationId, parseInt(locationId)));
    }

    if (expiring === "soon") {
      const today = format(new Date(), "yyyy-MM-dd");
      const weekFromNow = format(addDays(new Date(), 7), "yyyy-MM-dd");
      conditions.push(
        and(
          gte(items.expirationDate, today),
          lte(items.expirationDate, weekFromNow)
        )
      );
    } else if (expiring === "expired") {
      const today = format(new Date(), "yyyy-MM-dd");
      conditions.push(lte(items.expirationDate, today));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // Run all three queries in parallel — one serverless invocation instead of three
    const [itemsResult, categoriesResult, locationsResult] = await Promise.all([
      db
        .select({
          id: items.id,
          barcode: items.barcode,
          name: items.name,
          brand: items.brand,
          imageUrl: items.imageUrl,
          quantity: items.quantity,
          unit: items.unit,
          categoryId: items.categoryId,
          categoryName: categories.name,
          locationId: items.locationId,
          locationName: storageLocations.name,
          expirationDate: items.expirationDate,
          notes: items.notes,
          createdAt: items.createdAt,
        })
        .from(items)
        .leftJoin(categories, eq(items.categoryId, categories.id))
        .leftJoin(storageLocations, eq(items.locationId, storageLocations.id))
        .where(where)
        .orderBy(desc(items.createdAt)),
      db.select().from(categories).orderBy(asc(categories.name)),
      db.select().from(storageLocations).orderBy(asc(storageLocations.name)),
    ]);

    return NextResponse.json(
      {
        items: itemsResult,
        categories: categoriesResult,
        locations: locationsResult,
      },
      {
        headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" },
      }
    );
  } catch (error) {
    console.error("Error fetching items page data:", error);
    return NextResponse.json({ error: "Failed to fetch items page data" }, { status: 500 });
  }
}
