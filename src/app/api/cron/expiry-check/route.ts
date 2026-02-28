import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items, pushSubscriptions } from "@/db/schema";
import { and, lte, gte, eq } from "drizzle-orm";
import { sendPushNotification } from "@/lib/push";
import { format, addDays } from "date-fns";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = format(new Date(), "yyyy-MM-dd");
    const threeDaysFromNow = format(addDays(new Date(), 3), "yyyy-MM-dd");

    // Find items expiring within the next 3 days or expired today
    const expiringItems = await db
      .select()
      .from(items)
      .where(
        and(
          lte(items.expirationDate, threeDaysFromNow),
          gte(items.expirationDate, today)
        )
      );

    const subscriptions = await db.select().from(pushSubscriptions);

    if (expiringItems.length === 0 || subscriptions.length === 0) {
      return NextResponse.json({
        checked: expiringItems.length,
        sent: 0,
        cleaned: 0,
      });
    }

    let sent = 0;
    const expiredEndpoints = new Set<string>();

    // Build all notification tasks upfront, then execute in parallel batches
    const tasks: Array<{
      sub: (typeof subscriptions)[0];
      item: (typeof expiringItems)[0];
    }> = [];
    for (const sub of subscriptions) {
      for (const item of expiringItems) {
        tasks.push({ sub, item });
      }
    }

    // Process in batches of 10 to avoid overwhelming the push service
    const BATCH_SIZE = 10;
    for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
      const batch = tasks.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map(({ sub, item }) =>
          sendPushNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            {
              title: "Food Pantry Alert",
              body:
                item.expirationDate === today
                  ? `${item.name} expires today!`
                  : `${item.name} expires on ${item.expirationDate}`,
              url: `/items/${item.id}`,
              tag: `expiry-${item.id}`,
            }
          )
        )
      );

      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        if (result.status === "fulfilled") {
          if (result.value.success) sent++;
          if (result.value.expired) expiredEndpoints.add(batch[j].sub.endpoint);
        }
      }
    }

    // Clean up expired subscriptions in a single pass
    if (expiredEndpoints.size > 0) {
      await Promise.all(
        [...expiredEndpoints].map((endpoint) =>
          db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint))
        )
      );
    }

    return NextResponse.json({
      checked: expiringItems.length,
      sent,
      cleaned: expiredEndpoints.size,
    });
  } catch (error) {
    console.error("Error in expiry check:", error);
    return NextResponse.json({ error: "Failed to run expiry check" }, { status: 500 });
  }
}
