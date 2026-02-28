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

    let sent = 0;
    const expiredEndpoints: string[] = [];

    for (const sub of subscriptions) {
      for (const item of expiringItems) {
        const result = await sendPushNotification(
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
        );

        if (result.success) {
          sent++;
        } else if (result.expired) {
          expiredEndpoints.push(sub.endpoint);
        }
      }
    }

    // Clean up expired subscriptions
    for (const endpoint of expiredEndpoints) {
      await db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, endpoint));
    }

    return NextResponse.json({
      checked: expiringItems.length,
      sent,
      cleaned: expiredEndpoints.length,
    });
  } catch (error) {
    console.error("Error in expiry check:", error);
    return NextResponse.json({ error: "Failed to run expiry check" }, { status: 500 });
  }
}
