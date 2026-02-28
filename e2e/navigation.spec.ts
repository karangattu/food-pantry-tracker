import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  // These tests verify navigation structure without requiring auth
  // They will test the redirect behavior and page structure

  test("root redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("items page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/items");
    await expect(page).toHaveURL(/\/login/);
  });

  test("scan page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/scan");
    await expect(page).toHaveURL(/\/login/);
  });

  test("categories page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/categories");
    await expect(page).toHaveURL(/\/login/);
  });

  test("locations page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/locations");
    await expect(page).toHaveURL(/\/login/);
  });

  test("settings page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/login/);
  });

  test("offline page is accessible without auth", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByText(/offline/i)).toBeVisible();
  });
});
