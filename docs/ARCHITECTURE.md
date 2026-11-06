# DineFlow Architecture & Design Principles

## 1. Architectural Vision

DineFlow is designed as a production-grade, multi-tenant SaaS platform serving restaurant operators, kitchen teams, front-of-house staff, and dining guests.

To deliver maximum developer velocity, strong operational reliability, and type safety, DineFlow begins as a **disciplined modular monolith** powered by Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL, and Prisma ORM.

### Why a Modular Monolith?

- **Unified Domain Models**: Eliminates network boundaries, serialization overhead, and distributed transaction complexity between ordering, inventory, billing, and kitchen systems.
- **Strict Boundaries Without Microservices**: Code is organized into decoupled modules with clear visibility rules rather than premature microservice deployments.
- **Single Deployment Pipeline**: Atomic deployments reduce configuration drift and operational surface area.

---

## 2. Multi-Tenancy Architecture

A **Tenant** in DineFlow represents an independent restaurant business entity (e.g., an artisanal café brand, fine dining group, or multi-outlet burger franchise). Each tenant may operate one or more **Branches**.

```
[ DineFlow Platform ]
        │
        ├── Tenant A ("The Rustic Fork")
        │       ├── Branch 1: Downtown
        │       └── Branch 2: Uptown
        │
        └── Tenant B ("Sakura Sushi")
                ├── Branch 1: Harbor Bay
                └── Branch 2: Airport Terminal
```

### Strict Tenant Data Isolation

1. **Never Trust Browser Tenant IDs**:
   - The platform never relies on client-submitted `tenantId` query parameters or JSON body payloads for authorization.
   - Tenant context is always derived server-side from authenticated session claims and verified memberships.
2. **Mandatory Foreign Keys**:
   - Every domain entity belonging to a restaurant (branches, menus, categories, items, orders, tables, payments) maintains a direct `tenantId` reference.
3. **Defense-in-Depth Query Filtering**:
   - Server-only data access services enforce `tenantId` scoping in all Prisma queries (`where: { tenantId, ... }`).
   - Cross-tenant data leakage is prevented at both the service layer and database index level.

---

## 3. Layered Directory Structure

The project enforces strict separation between server execution, client presentation, and shared infrastructure:

- **`app/`**: Next.js App Router route segments, layouts, page components, and route handlers.
- **`components/`**: Pure, reusable presentation components (buttons, badges, icons, modals).
- **`features/`**: High-cohesion domain features (e.g., `features/tenant`, `features/auth`, and in future phases `features/kds`, `features/ordering`).
- **`lib/`**: Shared infrastructure utilities (environment parsing, error classes, response builders).
- **`server/`**: Server-only code, database client instantiation, domain service functions, and database query abstractions. Never imported into client bundles (`"use client"`).
- **`prisma/`**: Prisma PostgreSQL schema definitions, migration scripts, and seeds.
- **`types/`**: Shared TypeScript definitions, interfaces, and contextual types.
- **`validation/`**: Zod schemas for incoming API payloads and environment variables.
- **`docs/`**: Comprehensive system documentation, architectural specifications, and guides.

---

## 4. Server-Only Execution & Boundaries

To prevent leaking sensitive logic, connection strings, or query engines to client browsers:

- Database connections (`server/db/client.ts`) and Prisma query services reside exclusively inside the `server/` directory.
- Sensitive environment variables (`DATABASE_URL`) are never prefixed with `NEXT_PUBLIC_` and are inaccessible on the client.
- Route Handlers (`app/api/**/route.ts`) act as the secure gateway, validating inputs using Zod, executing service methods, and mapping results to standardized JSON responses.

---

## 5. Error Handling Conventions

A centralized hierarchy of error classes is defined in `lib/errors.ts`:

- `AppError`: Base application error with HTTP status code and machine-readable error code.
- `ValidationError`: Input validation failures (HTTP 400).
- `UnauthorizedError`: Missing or invalid authentication (HTTP 401).
- `ForbiddenError`: Authenticated user lacks permission (HTTP 403).
- `TenantIsolationError`: Cross-tenant access attempt detected (HTTP 403).
- `NotFoundError`: Resource not found (HTTP 404).
- `ConflictError`: Unique constraint or state conflict (HTTP 409).

The API response helper (`lib/api-response.ts`) automatically translates errors into consistent, secure JSON payloads without leaking internal stack traces in production.

---

## 6. Frontend Guidance & Design Principles

Following the project's modern frontend guidelines:

- **Semantic HTML & Accessibility**: Landmark regions (`<header>`, `<main>`, `<footer>`), ARIA attributes, keyboard-navigable interactive controls.
- **Logical CSS Properties**: Use of logical inline/block properties and container-aware spacing for internationalization and responsive adaptation.
- **Restrained Visual Aesthetics**: Warm ivory background (`#FAF8F5`), deep charcoal typography (`#1C1917`), and muted bronze accents (`#A37A3C`).
- **Layout Stability**: Reserving space for media and dynamic content to avoid Cumulative Layout Shift (CLS).
