# Food Pantry Tracker

A PWA for tracking food pantry inventory with barcode scanning, expiration alerts, and push notifications. Built with Next.js, Turso (SQLite), and Tailwind CSS.

## Features

- Barcode scanning via camera or manual entry
- Product lookup from Open Food Facts database
- Track quantity and expiration dates for pantry items
- Admin-managed categories and storage locations
- Expiration alerts with color-coded badges and push notifications
- Installable PWA with offline support
- Daily cron job for expiry notifications

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Database:** Turso (libSQL) + Drizzle ORM
- **Auth:** better-auth (email/password)
- **Barcode:** html5-qrcode (camera-based)
- **Product Data:** Open Food Facts API
- **UI:** Tailwind CSS 4 + shadcn/ui + Lucide icons
- **PWA:** @ducanh2912/next-pwa
- **Push:** web-push (VAPID)
- **Hosting:** Vercel

## Prerequisites

- Node.js 18+
- A [Turso](https://turso.tech) account (free tier works)
- VAPID keys for push notifications (optional)

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Turso database

```bash
# Install the Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create a database
turso db create food-pantry-tracker

# Get the connection URL
turso db show food-pantry-tracker --url

# Create an auth token
turso db tokens create food-pantry-tracker
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Database
TURSO_DATABASE_URL=libsql://your-db-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Auth
BETTER_AUTH_SECRET=your-random-secret-at-least-32-chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Push Notifications (optional)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:your-email@example.com

# Cron Auth (for Vercel cron jobs)
CRON_SECRET=your-cron-secret
```

To generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

To generate a random auth secret:

```bash
openssl rand -base64 32
```

### 4. Push the database schema

```bash
npx drizzle-kit push
```

### 5. Seed default data

```bash
npx tsx src/db/seed.ts
```

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** PWA features (service worker, offline support) are disabled in development mode to avoid caching issues. They activate automatically in production builds.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run test:all` | Run all tests |
| `npm run lint` | Lint the codebase |

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` to the Vercel project settings (use your production Turso URL and update `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` to your Vercel domain)
4. Deploy

The `vercel.json` configures a daily cron job at 8:00 AM UTC that checks for expiring items and sends push notifications to subscribed users.

## Project Structure

```
src/
  app/
    (auth)/          # Login and register pages
    (dashboard)/     # Main app pages (dashboard, items, scan, settings, etc.)
    api/             # API routes (items, categories, locations, auth, push, cron)
    offline/         # Offline fallback page
  components/        # React components (UI, barcode scanner, item cards, etc.)
  db/                # Drizzle schema, seed script, migrations
  hooks/             # Custom React hooks
  lib/               # Utilities (auth, expiry helpers, Open Food Facts client, etc.)
worker/              # Custom service worker (push notifications, cache busting)
```
