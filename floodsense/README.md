# FloodSense — Next.js Rendering Modes Implementation

## 1. Project Overview

FloodSense is a real-time flood risk visualization & alerting platform for flood-prone districts. It leverages open meteorological data for dashboards & resident alerts.

This repository demonstrates **three Next.js App Router rendering strategies**: SSG (Static Site Generation), SSR (Server-Side Rendering), and ISR (Incremental Static Regeneration).

## 2. Rendering Modes Implementation

### SSG (Static Site Generation)
**Location:** `/districts` page  
**File:** `src/app/districts/page.tsx`

- **How it works:** Pages are pre-rendered at build time into static HTML files
- **When to use:** Content that doesn't change frequently (district information, blog posts, documentation)
- **Performance:** Fastest - served from CDN as static files
- **Implementation:** No special configuration needed - Next.js automatically uses SSG when no dynamic functions are used

**Key Characteristics:**
- Data fetched during `npm run build`
- HTML files generated and cached
- No server computation needed at request time
- Perfect for SEO and performance

### SSR (Server-Side Rendering)
**Location:** `/alerts` page  
**File:** `src/app/alerts/page.tsx`

- **How it works:** Pages are rendered on the server for each request
- **When to use:** Real-time data, personalized content, frequently changing information
- **Performance:** Slower than SSG (requires server computation)
- **Implementation:** Uses `export const dynamic = 'force-dynamic'` to disable static generation

**Key Characteristics:**
- Data fetched on every request
- Fresh content always served
- No caching (unless explicitly configured)
- Uses `force-dynamic` export to ensure server-side rendering

### ISR (Incremental Static Regeneration)
**Location:** `/weather` page  
**File:** `src/app/weather/page.tsx`

- **How it works:** Pages are statically generated but regenerated periodically in the background
- **When to use:** Content that changes but doesn't need to be real-time (weather data, stock prices, analytics)
- **Performance:** Fast (static) with periodic updates
- **Implementation:** Uses `export const revalidate = 60` to regenerate every 60 seconds

**Key Characteristics:**
- Initial page generated at build time
- Regenerated in background at specified interval
- Users see cached version while regeneration happens
- Best balance of performance and freshness

## 3. Folder Structure
```
src/
├── app/          # Routes & Next.js App Router
│   ├── page.tsx           # Home page
│   ├── districts/         # SSG page
│   ├── alerts/            # SSR page
│   └── weather/           # ISR page
├── components/   # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── navbar.tsx
├── lib/          # Utilities, helpers, config
│   ├── types.ts           # TypeScript interfaces
│   ├── constants.ts       # Application constants
│   └── fetcher.ts         # Data fetching functions
└── hooks/        # Custom hooks (future)
```

## 4. Folder Purpose & Conventions

| Folder | Purpose |
|--------|---------|
| `app/` | Responsible for routing, server components, and pages. Each subdirectory represents a route. |
| `components/` | Shared UI pieces used across pages (Button, Card, Navbar) |
| `lib/` | API helpers, constants, fetchers, configs, and TypeScript types |
| `hooks/` | Reusable hooks for data-fetching & logic (future) |

## 5. Technical Implementation Details

### SSG Implementation (`/districts`)
```typescript
// No special exports needed - Next.js detects static generation
export default async function DistrictsPage() {
  const districts = await fetchDistricts(); // Fetched at build time
  // ... render districts
}
```

### SSR Implementation (`/alerts`)
```typescript
export const dynamic = 'force-dynamic'; // Forces server-side rendering

export default async function AlertsPage() {
  const alerts = await fetchFloodAlerts(); // Fetched on every request
  // ... render alerts
}
```

### ISR Implementation (`/weather`)
```typescript
export const revalidate = 60; // Regenerate every 60 seconds

export default async function WeatherPage() {
  const weather = await fetchWeatherData(); // Cached, regenerated periodically
  // ... render weather
}
```

## 6. Setup Instructions

```bash
git clone <repo-url>
cd floodsense
npm install
npm run dev
```

**Local Development:** http://localhost:3000

## 6.1 Environment setup (dev / staging / production)

### Files

- **Tracked**: `.env.example` (safe template, no secrets)
- **Ignored**: `.env*` via `.gitignore` (so `.env.development`, `.env.staging`, `.env.production`, etc. are not committed)

### How to use

1. Copy the template:

```bash
cp .env.example .env.development
```

2. Edit values in `.env.development` for your environment.

### Variables used in code

- **`NEXT_PUBLIC_API_URL`**: read in `src/lib/constants.ts` as the API base URL (falls back to `https://api.floodsense.example.com`).

### Staging and production

- Create `.env.staging` for staging values (kept local / in deployment provider secrets).
- Create `.env.production` for production values (kept local / in deployment provider secrets).

Important: Next.js automatically loads `.env.development` and `.env.production` based on `NODE_ENV`. “Staging” is typically handled by your hosting platform (Vercel/GitHub Actions/etc.) by injecting environment variables for that environment.

**Build for Production:**
```bash
npm run build
npm start
```

## 7. Pages Overview

- **`/`** - Home page showcasing all rendering modes
- **`/districts`** - SSG example (static district information)
- **`/alerts`** - SSR example (real-time flood alerts)
- **`/weather`** - ISR example (weather data with periodic updates)

## 8. Fetch Caching Strategies

### Static Generation (SSG)
- Default behavior in Next.js App Router
- `fetch()` calls are cached indefinitely
- Use `cache: 'no-store'` to disable caching if needed

### Server-Side Rendering (SSR)
- `force-dynamic` disables all caching
- All `fetch()` calls use `cache: 'no-store'` automatically
- Fresh data on every request

### Incremental Static Regeneration (ISR)
- `revalidate` option sets regeneration interval
- `fetch()` calls can use `next: { revalidate: 60 }` for per-request revalidation
- Background regeneration keeps content fresh

## 9. Best Practices Demonstrated

✅ **SSG for static content** - District information that rarely changes  
✅ **SSR for real-time data** - Flood alerts that need to be current  
✅ **ISR for semi-dynamic content** - Weather data that updates periodically  
✅ **Proper TypeScript types** - Type-safe data structures  
✅ **Reusable components** - DRY principle with shared UI components  
✅ **Clear code comments** - Explains rendering mode choices  

## 10. Scalability Reflection

We chose this structure because:

✔ Separation of UI + logic + routing  
✔ Scales well for full-stack Next.js projects  
✔ App Router aligns with future backend needs (API routes, server components)  
✔ Components stay reusable & testable  
✔ Clear for multi-member teamwork  

This helps our team ship new features faster & avoid code clutter as the project grows.

## 11. Team Reflection

"If FloodSense were a real-world product, this folder structure and rendering strategy selection would allow us to optimize performance based on content type. Static district pages load instantly, real-time alerts are always fresh, and weather data balances speed with freshness. This creates an optimal user experience while maintaining scalability and developer productivity."

## 12. Screenshot
![alt text](image.png)
