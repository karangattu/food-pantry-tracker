import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items, categories, storageLocations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
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
        updatedAt: items.updatedAt,
      })
      .from(items)
      .leftJoin(categories, eq(items.categoryId, categories.id))
      .leftJoin(storageLocations, eq(items.locationId, storageLocations.id))
      .where(eq(items.id, parseInt(id)));

    if (result.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { barcode, name, brand, imageUrl, quantity, unit, categoryId, locationId, expirationDate, notes } = body;

    const result = await db
      .update(items)
      .set({
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
        updatedAt: new Date().toISOString().split("T")[0],
      })
      .where(eq(items.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await db
      .delete(items)
      .where(eq(items.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
