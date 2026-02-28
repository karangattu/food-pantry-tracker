import { describe, it, expect } from "vitest";
import {
  user,
  session,
  account,
  verification,
  categories,
  storageLocations,
  items,
  dismissedAlerts,
  pushSubscriptions,
} from "@/db/schema";
import { getTableName } from "drizzle-orm";

describe("database schema", () => {
  describe("table names", () => {
    it("user table has correct name", () => {
      expect(getTableName(user)).toBe("user");
    });

    it("session table has correct name", () => {
      expect(getTableName(session)).toBe("session");
    });

    it("account table has correct name", () => {
      expect(getTableName(account)).toBe("account");
    });

    it("verification table has correct name", () => {
      expect(getTableName(verification)).toBe("verification");
    });

    it("categories table has correct name", () => {
      expect(getTableName(categories)).toBe("categories");
    });

    it("storageLocations table has correct name", () => {
      expect(getTableName(storageLocations)).toBe("storage_locations");
    });

    it("items table has correct name", () => {
      expect(getTableName(items)).toBe("items");
    });

    it("dismissedAlerts table has correct name", () => {
      expect(getTableName(dismissedAlerts)).toBe("dismissed_alerts");
    });

    it("pushSubscriptions table has correct name", () => {
      expect(getTableName(pushSubscriptions)).toBe("push_subscriptions");
    });
  });

  describe("table columns", () => {
    it("items table has all required columns", () => {
      const columns = Object.keys(items);
      expect(columns).toContain("id");
      expect(columns).toContain("barcode");
      expect(columns).toContain("name");
      expect(columns).toContain("brand");
      expect(columns).toContain("imageUrl");
      expect(columns).toContain("quantity");
      expect(columns).toContain("unit");
      expect(columns).toContain("categoryId");
      expect(columns).toContain("locationId");
      expect(columns).toContain("expirationDate");
      expect(columns).toContain("notes");
      expect(columns).toContain("addedBy");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });

    it("categories table has required columns", () => {
      const columns = Object.keys(categories);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("createdAt");
    });

    it("storageLocations table has required columns", () => {
      const columns = Object.keys(storageLocations);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("createdAt");
    });

    it("pushSubscriptions table has required columns", () => {
      const columns = Object.keys(pushSubscriptions);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("endpoint");
      expect(columns).toContain("p256dh");
      expect(columns).toContain("auth");
      expect(columns).toContain("createdAt");
    });

    it("user table has required columns for better-auth", () => {
      const columns = Object.keys(user);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("email");
      expect(columns).toContain("emailVerified");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });
  });
});
