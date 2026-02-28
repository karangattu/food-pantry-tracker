import type { ProductLookupResult } from "./open-food-facts";

/**
 * Client-side barcode lookup via Open Food Facts public API.
 * This avoids invoking a serverless function for product lookups.
 */
export async function lookupBarcodeClient(barcode: string): Promise<ProductLookupResult> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
      {
        headers: {
          "User-Agent": "FoodPantryTracker/1.0",
        },
      }
    );

    if (!response.ok) {
      return { found: false };
    }

    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return { found: false };
    }

    const product = data.product;

    return {
      found: true,
      name: product.product_name || undefined,
      brand: product.brands || undefined,
      imageUrl: product.image_url || undefined,
      category: product.categories?.split(",")[0]?.trim() || undefined,
    };
  } catch {
    return { found: false };
  }
}
