import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items, dismissedAlerts, categories, storageLocations } from "@/db/schema";
import { eq, and, lte, gte, notInArray, desc, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { format, addDays } from "date-fns";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = format(new Date(), "yyyy-MM-dd");
    const weekFromNow = format(addDays(new Date(), 7), "yyyy-MM-dd");

    // Run all queries in parallel — single serverless invocation instead of 4
    const [recentItems, totalResult, expiringSoonResult, expiredResult, dismissed] =
      await Promise.all([
        // Recent 5 items
        db
          .select({
            id: items.id,
            name: items.name,
            brand: items.brand,
            imageUrl: items.imageUrl,
            imageData: items.imageData,
            quantity: items.quantity,
            unit: items.unit,
            locationName: storageLocations.name,
            expirationDate: items.expirationDate,
          })
          .from(items)
          .leftJoin(storageLocations, eq(items.locationId, storageLocations.id))
          .orderBy(desc(items.createdAt))
          .limit(5),

        // Total count
        db.select({ value: count() }).from(items),

        // Expiring soon count (within 7 days, not yet expired)
        db
          .select({ value: count() })
          .from(items)
          .where(and(gte(items.expirationDate, today), lte(items.expirationDate, weekFromNow))),

        // Expired count
        db
          .select({ value: count() })
          .from(items)
          .where(lte(items.expirationDate, today)),

        // Dismissed alert IDs for this user
        db
          .select({ itemId: dismissedAlerts.itemId })
          .from(dismissedAlerts)
          .where(eq(dismissedAlerts.userId, session.user.id)),
      ]);

    const dismissedIds = dismissed.map((d) => d.itemId);

    // Alerts: items expiring within 7 days, not dismissed
    const alerts = await db
      .select({
        id: items.id,
        name: items.name,
        brand: items.brand,
        expirationDate: items.expirationDate,
        locationName: storageLocations.name,
      })
      .from(items)
      .leftJoin(storageLocations, eq(items.locationId, storageLocations.id))
      .where(
        and(
          lte(items.expirationDate, weekFromNow),
          gte(items.expirationDate, "2000-01-01"),
          dismissedIds.length > 0 ? notInArray(items.id, dismissedIds) : undefined
        )
      );

    return NextResponse.json(
      {
        recentItems,
        totalCount: totalResult[0]?.value ?? 0,
        expiringCount: expiringSoonResult[0]?.value ?? 0,
        expiredCount: expiredResult[0]?.value ?? 0,
        alerts,
      },
      {
        headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" },
      }
    );
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
