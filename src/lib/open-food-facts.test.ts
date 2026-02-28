import { describe, it, expect, vi, beforeEach } from "vitest";
import { lookupBarcode } from "@/lib/open-food-facts";

describe("open-food-facts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("lookupBarcode", () => {
    it("returns product data when found", async () => {
      const mockResponse = {
        status: 1,
        product: {
          product_name: "Organic Pasta",
          brands: "Brand X",
          image_url: "https://example.com/image.jpg",
          categories: "Pasta, Dry Goods, Organic",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await lookupBarcode("1234567890");

      expect(result.found).toBe(true);
      expect(result.name).toBe("Organic Pasta");
      expect(result.brand).toBe("Brand X");
      expect(result.imageUrl).toBe("https://example.com/image.jpg");
      expect(result.category).toBe("Pasta");
    });

    it("returns found:false when product not found (status 0)", async () => {
      const mockResponse = {
        status: 0,
        product: null,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await lookupBarcode("0000000000");

      expect(result.found).toBe(false);
      expect(result.name).toBeUndefined();
    });

    it("returns found:false when HTTP error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await lookupBarcode("9999999999");

      expect(result.found).toBe(false);
    });

    it("returns found:false when fetch throws", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const result = await lookupBarcode("1111111111");

      expect(result.found).toBe(false);
    });

    it("handles missing product fields gracefully", async () => {
      const mockResponse = {
        status: 1,
        product: {
          product_name: "Simple Product",
          // no brands, image_url, or categories
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await lookupBarcode("5555555555");

      expect(result.found).toBe(true);
      expect(result.name).toBe("Simple Product");
      expect(result.brand).toBeUndefined();
      expect(result.imageUrl).toBeUndefined();
      expect(result.category).toBeUndefined();
    });

    it("takes only the first category when multiple are present", async () => {
      const mockResponse = {
        status: 1,
        product: {
          product_name: "Test",
          categories: "  Beverages , Juices , Organic  ",
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await lookupBarcode("7777777777");

      expect(result.category).toBe("Beverages");
    });

    it("encodes barcode in URL correctly", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 0 }),
      });

      await lookupBarcode("123 456");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("123%20456"),
        expect.any(Object)
      );
    });

    it("sends correct User-Agent header", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 0 }),
      });

      await lookupBarcode("1234567890");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "User-Agent": "FoodPantryTracker/1.0" },
        })
      );
    });
  });
});
