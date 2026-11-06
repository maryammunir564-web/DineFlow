# DineFlow Product & Engineering Roadmap

DineFlow is developed in structured, iterative phases to maintain production quality, architectural integrity, and strict tenant isolation.

---

## Phase 1: Project Foundation (Current Phase — Complete)

- [x] Initialized Next.js App Router modular monolith with TypeScript strict mode.
- [x] Configured Tailwind CSS, PostCSS, ESLint, and Prettier.
- [x] Configured PostgreSQL Prisma schema with initial core domain models:
  - `Tenant`, `Branch`, `User`, `Role`, `Membership`, `BranchMembership`
- [x] Implemented type-safe environment variable parsing with Zod (`lib/env.ts`).
- [x] Implemented global Prisma client singleton (`server/db/client.ts`).
- [x] Built centralized error-handling conventions and standardized API response utilities.
- [x] Created server-side health check endpoint (`/api/health`) with isolated database probing.
- [x] Designed restrained, responsive foundation interface following modern frontend guidance.
- [x] Comprehensive architectural, database, and development documentation.

---

## Phase 2: Tenant Management & Authentication Foundation (Recommended Next)

- [ ] Secure multi-tenant authentication (session management, JWT/cookie tokens, password hashing).
- [ ] Tenant onboarding flow (create restaurant organization, unique slug, initial branch).
- [ ] Role-based access control (RBAC) middleware verifying tenant membership and granular permissions.
- [ ] Tenant context resolution (subdomain-based, path-based, and session-derived).
- [ ] Staff invitation and branch assignment workflows.

---

## Phase 3: Menu & Catalog Management

- [ ] Menu categories, items, modifier groups, and options models.
- [ ] Dietary flags, allergens, calorie counts, and image assets.
- [ ] Pricing models with branch-level price overrides.
- [ ] Item availability toggles (86'd / out-of-stock items) synced across ordering and KDS.
- [ ] Rich manager interface for menu composition.

---

## Phase 4: Table Sessions & Customer QR/NFC Ordering

- [ ] Dynamic QR code generation for physical restaurant tables.
- [ ] NFC tag URL integration and table session initiation.
- [ ] Guest ordering experience (mobile-first, no app install required).
- [ ] Shared real-time table cart (multi-guest collaborative ordering).
- [ ] Order submission and status tracking for dining guests.

---

## Phase 5: Kitchen Display System (KDS) & Staff Operations

- [ ] Real-time order routing by kitchen prep station (e.g., Grill, Cold, Bar).
- [ ] Live ticket updates, item timer alerts, and course sequencing.
- [ ] Waiter dashboard for table status, call-waiter alerts, and order delivery.
- [ ] Expediter screen for order assembly and completion.

---

## Phase 6: POS, Billing & Split Payments

- [ ] Front-of-house POS interface for counter and table service.
- [ ] Flexible bill splitting (by seat, by item, or equal division).
- [ ] Multi-payment support (card, cash, digital wallets, tip handling).
- [ ] Receipt generation and integration with receipt printers / digital receipts.

---

## Phase 7: Restaurant Owner Portal & Multi-Branch Analytics

- [ ] Real-time sales, order volume, and revenue analytics.
- [ ] Popular items, peak-hour occupancy, and table turnover metrics.
- [ ] Multi-branch operational comparison dashboard.
- [ ] Staff performance and labor tracking.

---

## Phase 8: DineFlow Super Admin, Subscriptions & Onboarding

- [ ] Platform Super Admin dashboard for managing all restaurant tenants.
- [ ] SaaS subscription tiers, billing integration (Stripe / LemonSqueezy), and usage metering.
- [ ] Tenant feature toggling and system maintenance controls.
- [ ] Automated tenant onboarding wizard.
