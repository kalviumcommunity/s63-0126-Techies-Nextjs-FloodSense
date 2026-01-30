# FloodSense — Next.js Rendering Modes Implementation
1. Project Overview

FloodSense is a real-time flood risk visualization and alerting platform for flood-prone districts.
It leverages open meteorological data to provide dashboards and timely alerts to residents.

This repository demonstrates three core rendering strategies in Next.js App Router:


SSG – Static Site Generation

SSR – Server-Side Rendering

ISR – Incremental Static Regeneration

The goal is to understand when and why to use each rendering mode in real-world applications.

2. Rendering Modes Used (High-Level Summary)
Page	Rendering Mode	Purpose
/districts	SSG	Static district information
/alerts	SSR	Real-time flood alerts
/weather	ISR	Weather data with periodic updates

3. Rendering Modes Implementation (Detailed)
3.1 SSG — Static Site Generation

Route: /districts
File: src/app/districts/page.tsx

How it works

Pages are generated once at build time

Output is static HTML served from CDN

When to use

Content that changes rarely (district info, docs, blogs)

Performance

Fastest possible (no server work on request)

Implementation

// No special exports required
export default async function DistrictsPage() {
  const districts = await fetchDistricts();
}


Key Characteristics

Data fetched during npm run build

No runtime server cost

Excellent SEO and performance

3.2 SSR — Server-Side Rendering

Route: /alerts
File: src/app/alerts/page.tsx

How it works

Page is rendered on every request

Always serves fresh data

When to use

Live data, alerts, dashboards, personalized views

Performance

Slower than SSG (server computation required)

Implementation

export const dynamic = 'force-dynamic';

export default async function AlertsPage() {
  const alerts = await fetchFloodAlerts();
}


Key Characteristics

No caching

Fresh data on every request

Higher server cost

3.3 ISR — Incremental Static Regeneration

Route: /weather
File: src/app/weather/page.tsx

How it works

Page is static but re-generated periodically

Users see cached page while regeneration happens

When to use

Semi-dynamic content (weather, analytics, product listings)

Performance

Near-static speed with periodic freshness

Implementation

export const revalidate = 60;

export default async function WeatherPage() {
  const weather = await fetchWeatherData();
}


Key Characteristics

Best balance of performance and freshness

Scales better than SSR

4. Project Folder Structure
src/
├── app/
│   ├── page.tsx        # Home
│   ├── districts/      # SSG
│   ├── alerts/         # SSR
│   └── weather/        # ISR
├── components/
├── lib/
└── hooks/

5. Folder Purpose & Conventions
Folder	Purpose
app/	Routing and server components
components/	Reusable UI elements
lib/	Utilities, constants, fetch logic
hooks/	Custom hooks (future use)

6. Fetch Caching Behavior
SSG

fetch() cached at build time

No re-fetching at runtime

SSR

force-dynamic disables caching

fetch() behaves as no-store

ISR

revalidate controls regeneration interval

Background regeneration keeps content fresh

7. Environment Setup (dev / staging / production)
Files

✅ Tracked: .env.example

❌ Ignored: .env* via .gitignore

Usage
cp .env.example .env.development

Variables

NEXT_PUBLIC_API_URL
Used in src/lib/constants.ts (fallback included)

Staging & Production

Values are injected via hosting platforms (Vercel / GitHub Actions)

.env.staging and .env.production are never committed

8. Docker (Optional)

Docker support is included to demonstrate containerization for CI/CD and cloud deployments.

Build & Run
docker build -t floodsense .
docker run -p 3000:3000 floodsense

Why Docker Matters

Docker – Same app runs everywhere

CI/CD – Automated builds in pipelines

Cloud – Containers run directly on AWS/Azure

Multi-stage Dockerfile and .dockerignore ensure:

Smaller images

No secrets inside containers

No app logic changes

9. Pages Overview

/ — Home (overview)

/districts — SSG example

/alerts — SSR example

/weather — ISR example

10. Best Practices Demonstrated

✅ Correct rendering mode selection
✅ Performance-first architecture
✅ Secure environment handling
✅ Modular folder structure
✅ Scalable App Router design

11. Scalability Reflection

If user traffic increased 10×:
Static and ISR pages would scale effortlessly
SSR would be limited to real-time alert data only
This minimizes server cost while preserving freshness where needed

12. Team Reflection

“FloodSense demonstrates how choosing the right rendering strategy improves performance, scalability, and developer productivity. Static pages load instantly, real-time alerts stay fresh, and weather data balances speed with accuracy.”

## 13. Screenshot
![alt text](image.png)
