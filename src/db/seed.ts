import { db } from "./index";
import { categories, storageLocations } from "./schema";

const defaultCategories = [
  "Canned Goods",
  "Dry Goods",
  "Beverages",
  "Snacks",
  "Dairy",
  "Frozen",
  "Produce",
  "Condiments",
  "Grains & Pasta",
  "Other",
];

const defaultLocations = [
  "Shelf A",
  "Shelf B",
  "Shelf C",
  "Refrigerator",
  "Freezer",
  "Other",
];

async function seed() {
  console.log("Seeding database...");

  for (const name of defaultCategories) {
    try {
      await db.insert(categories).values({ name }).onConflictDoNothing();
    } catch {
      // ignore duplicate
    }
  }
  console.log(`Seeded ${defaultCategories.length} categories`);

  for (const name of defaultLocations) {
    try {
      await db.insert(storageLocations).values({ name }).onConflictDoNothing();
    } catch {
      // ignore duplicate
    }
  }
  console.log(`Seeded ${defaultLocations.length} storage locations`);

  console.log("Seeding complete!");
}

seed().catch(console.error);
