import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items, categories, storageLocations } from "@/db/schema";
import { eq, and, like, or, lte, gte, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { format, addDays } from "date-fns";

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

    const result = await db
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
      .orderBy(desc(items.createdAt));

    return NextResponse.json(result, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { barcode, name, brand, imageUrl, quantity, unit, categoryId, locationId, expirationDate, notes } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await db.insert(items).values({
      barcode: barcode || null,
      name,
      brand: brand || null,
      imageUrl: imageUrl || null,
      quantity: quantity || 1,
      unit: unit || null,
      categoryId: categoryId || null,
      locationId: locationId || null,
      expirationDate: expirationDate || null,
      notes: notes || null,
      addedBy: session.user.id,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
