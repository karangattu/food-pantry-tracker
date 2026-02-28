import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items, dismissedAlerts, categories, storageLocations } from "@/db/schema";
import { eq, and, lte, gte, notInArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { format, addDays } from "date-fns";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const weekFromNow = format(addDays(new Date(), 7), "yyyy-MM-dd");

    // Get dismissed item IDs for this user
    const dismissed = await db
      .select({ itemId: dismissedAlerts.itemId })
      .from(dismissedAlerts)
      .where(eq(dismissedAlerts.userId, session.user.id));

    const dismissedIds = dismissed.map((d) => d.itemId);

    // Get items expiring within 7 days or already expired
    const query = db
      .select({
        id: items.id,
        name: items.name,
        brand: items.brand,
        imageUrl: items.imageUrl,
        quantity: items.quantity,
        unit: items.unit,
        expirationDate: items.expirationDate,
        categoryName: categories.name,
        locationName: storageLocations.name,
      })
      .from(items)
      .leftJoin(categories, eq(items.categoryId, categories.id))
      .leftJoin(storageLocations, eq(items.locationId, storageLocations.id))
      .where(
        and(
          lte(items.expirationDate, weekFromNow),
          gte(items.expirationDate, "2000-01-01"),
          dismissedIds.length > 0
            ? notInArray(items.id, dismissedIds)
            : undefined
        )
      );

    const result = await query;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { itemId } = await request.json();
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    await db.insert(dismissedAlerts).values({
      itemId,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error dismissing alert:", error);
    return NextResponse.json({ error: "Failed to dismiss alert" }, { status: 500 });
  }
}
