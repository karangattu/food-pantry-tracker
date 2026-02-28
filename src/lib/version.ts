export const APP_VERSION = "1.0.0";

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2026-02-28",
    changes: [
      "Initial release of Food Pantry Tracker",
      "Barcode scanning via camera or manual entry",
      "Product lookup from Open Food Facts database",
      "Track quantity and expiration dates for pantry items",
      "Admin-managed categories and storage locations",
      "Expiration alerts with push notifications",
      "Responsive PWA: works on desktop and mobile",
      "Offline support with cached pages",
    ],
  },
];
