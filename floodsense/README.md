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

8.1 Docker Compose (Local Development)

For local development with **PostgreSQL** and **Redis** running automatically, use Docker Compose.

What you get
- **App**: Next.js dev server at `http://localhost:3000`
- **PostgreSQL**: Database at `localhost:5432`
- **Redis**: Cache at `localhost:6379`

Start (first time or after changes)

```bash
docker compose up --build
```

Stop

```bash
docker compose down
```

Reset database/cache (deletes volumes)

```bash
docker compose down -v
```

Default connection strings (already set inside `docker-compose.yml`)
- **Postgres**: `postgresql://floodsense:floodsense@postgres:5432/floodsense`
- **Redis**: `redis://redis:6379`

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

---

## 13. PostgreSQL Schema (Beginner-Level, Normalized)

This project can use PostgreSQL to store **users**, **districts**, and **flood alerts** in a normalized relational structure.

- **Schema file**: `schema.sql`
- **Core entities**: `app_user`, `district`, `alert`
- **Relationship table**: `user_district_subscription` (many-to-many)

### Tables and relationships

- **`app_user` (User)**
  - One row per user.
  - Key fields: `user_id` (PK), `email` (UNIQUE), `created_at`.

- **`district` (District)**
  - One row per district/location.
  - Key fields: `district_id` (PK), `name`, `country`.
  - Constraint example: district name is unique within a country (`UNIQUE (name, country)`).

- **`user_district_subscription` (User ↔ District)**
  - Implements **many-to-many**: a user can follow many districts, and a district can be followed by many users.
  - Composite primary key: `(user_id, district_id)`
  - Foreign keys:
    - `user_id` → `app_user(user_id)` (ON DELETE CASCADE)
    - `district_id` → `district(district_id)` (ON DELETE CASCADE)

- **`alert` (Alert)**
  - One row per alert issued for a district.
  - Foreign keys:
    - `district_id` → `district(district_id)` (alerts belong to a district)
    - `created_by` → `app_user(user_id)` (optional: who posted it)
  - Basic constraints:
    - `severity` and `status` are enums (controlled set of values)
    - `expires_at` must be after `issued_at` (if provided)

### Normalization notes (1NF / 2NF / 3NF)

- **1NF (atomic values)**: Fields like `title`, `message`, `email` store single values (no lists inside columns).
- **2NF (no partial dependency)**: The subscription table uses a composite key `(user_id, district_id)` and only stores subscription-specific attributes like `subscribed_at`.
- **3NF (no transitive dependency)**:
  - District data (name, coordinates) is stored only in `district`, not repeated on every alert.
  - User data (email, name) is stored only in `app_user`, not repeated on alerts/subscriptions.

This keeps the database consistent and avoids update anomalies (e.g., editing a district name in one place updates it everywhere).

## 13. Screenshot
![alt text](image.png)

## 14. Team Git Workflow

This section describes how the team uses Git and GitHub for collaboration. It is aimed at beginner-level teams (e.g. college projects).

### Branch naming conventions

All work is done on branches. Branch names must start with one of these prefixes:

| Prefix   | Use for |
|----------|--------|
| `feature/` | New features or enhancements (e.g. `feature/weather-widget`) |
| `fix/`     | Bug fixes (e.g. `fix/alert-refresh`) |
| `docs/`    | Documentation only (e.g. `docs/readme-setup`) |
| `chore/`   | Tooling, config, or maintenance — no app code change (e.g. `chore/update-deps`) |

**Examples:** `feature/add-export`, `fix/navbar-mobile`, `docs/api-usage`, `chore/eslint-config`.

### Branching strategy

- **`main`** — Stable, working code. Only updated via merged pull requests.
- **Short-lived branches** — Create one branch per task (feature, fix, docs, or chore). When the task is done, open a PR into `main` and delete the branch after merge.

**Workflow in short:** Create branch from `main` → Make changes → Push → Open PR → Get review → Merge → Delete branch.

### Pull request (PR) process

1. **Create a branch** from the latest `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** and commit with clear messages.
3. **Push the branch** and open a **Pull Request** on GitHub into `main`.
4. **Fill out the PR template** (description, branch type, how to test). The template appears automatically when you open a PR.
5. **Request a review** from a teammate. They use the **code review checklist** in the PR to approve or request changes.
6. **Address feedback** if any, then merge once approved. Delete the branch after merging.

PR template and code review checklist live in [`.github/pull_request_template.md`](.github/pull_request_template.md).

### Benefits of this workflow

- **Clear history** — Branch names show what each change is for (feature, fix, docs, chore).
- **Safe `main`** — Nothing lands on `main` without a PR and review.
- **Learning** — Everyone practices branching, PRs, and code review.
- **Fewer conflicts** — Small, focused branches reduce merge conflicts.
- **Accountability** — Every change is linked to a PR and can be discussed.

---

🔐 Environment Variables

FloodSense uses environment variables to securely manage secrets such as database credentials, API keys, and authentication secrets.

Environment Files
File	Purpose
.env.local	Stores real secrets (never committed)
.env.example	Template for developers
Server-Side Variables

These are NOT exposed to the browser:

DATABASE_URL

REDIS_URL

AUTH_SECRET

OPENWEATHER_API_KEY

Used only inside:

✔ API routes
✔ server components
✔ backend utilities

Client-Safe Variables

Must start with:

NEXT_PUBLIC_


Example:

NEXT_PUBLIC_API_BASE_URL

NEXT_PUBLIC_APP_NAME

These are safe because they are bundled into the frontend.

Setup Instructions

1️⃣ Copy template:

cp .env.example .env.local


2️⃣ Replace placeholder values.

3️⃣ Restart dev server:

npm run dev

Security Pitfalls Avoided

✔ Secrets never committed
✔ Server-only variables not used in client components
✔ Proper NEXT_PUBLIC prefix usage
✔ Centralized environment access
✔ Runtime-safe configuration

This ensures FloodSense remains secure, portable, and production-ready.

## 🗄️ PostgreSQL Schema Design

FloodSense uses a normalized PostgreSQL schema designed with Prisma ORM.

### Core Entities
- User
- District
- WeatherData
- AlertPreference

### Relationships
- User ↔ AlertPreference (1:1)
- District ↔ WeatherData (1:N)

### Normalization
- Follows 1NF, 2NF, and 3NF
- No redundant or derived fields
- Clear separation of concerns

### Scalability
- Indexed foreign keys
- Time-based weather queries
- Cascading deletes prevent orphan data
