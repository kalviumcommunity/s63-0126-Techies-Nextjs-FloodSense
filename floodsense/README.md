FloodSense — Project Initialization
1. Project Overview

FloodSense is a real-time flood risk visualization & alerting platform for flood-prone districts. It leverages open meteorological data for dashboards & resident alerts.

This repository contains our base full-stack setup using Next.js + TypeScript.

2. Folder Structure
src/
├── app/          # Routes & Next.js App Router
├── components/   # Reusable UI components
├── lib/          # Utilities, helpers, config
├── hooks/        # Custom hooks (future)
├── styles/       # Global styling

3. Folder Purpose & Conventions
Folder	Purpose
app/	Responsible for routing, server components, and pages
components/	Shared UI pieces used across pages
lib/	API helpers, constants, fetchers, configs
hooks/	Reusable hooks for data-fetching & logic
styles/	Stylesheets and Tailwind (if enabled)
4. Scalability Reflection

We chose this structure because:

✔ Separation of UI + logic + routing
✔ Scales well for full-stack Next.js projects
✔ App Router aligns with future backend needs (API routes, server components)
✔ Components stay reusable & testable
✔ Clear for multi-member teamwork

This helps our team ship new features faster & avoid code clutter as the project grows.

5. Setup Instructions
git clone <repo-url>
cd floodsense
npm install
npm run dev


Local Development:

http://localhost:3000

6. Screenshot
![alt text](image.png)

7. Team Reflection for Sprint-1

“If FloodSense were a real-world product, this folder structure would allow us to add features (like districts, dashboards, alerts) without breaking others. New pages go into app/, shared UI in components/, configs in lib/. This creates parallel development, fewer merge conflicts, and cleaner evolution over sprints.”