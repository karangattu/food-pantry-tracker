import { test, expect } from "@playwright/test";

test.describe("API Routes", () => {
  test("product lookup API rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get("/api/product-lookup?barcode=3017620422003");
    // Should not return successful data without authentication
    expect(response.status()).not.toBe(200);
  });

  test("product lookup API rejects missing barcode", async ({ request }) => {
    const response = await request.get("/api/product-lookup");
    // Should return 401 (auth) or 400 (missing param)
    expect(response.status()).not.toBe(200);
  });

  test("items API rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get("/api/items");
    expect(response.status()).not.toBe(200);
  });

  test("categories API rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get("/api/categories");
    expect(response.status()).not.toBe(200);
  });

  test("locations API rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get("/api/locations");
    expect(response.status()).not.toBe(200);
  });

  test("alerts API rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get("/api/alerts");
    expect(response.status()).not.toBe(200);
  });

  test("cron endpoint rejects unauthorized requests", async ({ request }) => {
    const response = await request.get("/api/cron/expiry-check");
    expect(response.status()).toBe(401);
  });

  test("cron endpoint rejects wrong secret", async ({ request }) => {
    const response = await request.get("/api/cron/expiry-check", {
      headers: { Authorization: "Bearer wrong-secret" },
    });
    expect(response.status()).toBe(401);
  });

  test("push subscribe rejects unauthenticated requests", async ({ request }) => {
    const response = await request.post("/api/push/subscribe", {
      data: { endpoint: "https://example.com", keys: { p256dh: "a", auth: "b" } },
    });
    expect(response.status()).not.toBe(200);
  });

  test("items POST rejects unauthenticated requests", async ({ request }) => {
    const response = await request.post("/api/items", {
      data: { name: "Test Item", quantity: 1 },
    });
    expect(response.status()).not.toBe(200);
  });
});
