import { test, expect } from "@playwright/test";

test.describe("PWA and Accessibility", () => {
  test("manifest.json is accessible", async ({ request }) => {
    const response = await request.get("/manifest.json");
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest.name).toBe("Food Pantry Tracker");
    expect(manifest.short_name).toBe("Pantry");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test("icons are accessible", async ({ request }) => {
    const response192 = await request.get("/icons/icon-192x192.svg");
    expect(response192.ok()).toBeTruthy();

    const response512 = await request.get("/icons/icon-512x512.svg");
    expect(response512.ok()).toBeTruthy();
  });

  test("login page has proper page title", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/food pantry/i);
  });

  test("login page has accessible form inputs", async ({ page }) => {
    await page.goto("/login");
    const emailInput = page.getByPlaceholder("you@example.com");
    const passwordInput = page.getByPlaceholder("Password");
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("offline page renders correctly", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByText(/offline/i)).toBeVisible();
    await expect(page.getByText(/reconnect/i)).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("login page renders on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("login page renders on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/login");
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  });

  test("login page renders on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/login");
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  });
});
