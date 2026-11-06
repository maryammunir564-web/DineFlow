# DineFlow

> **Your Restaurant. Every Table. One Connected System.**

DineFlow is a production-grade, multi-tenant SaaS platform built for modern restaurant operations, QR/NFC table ordering, real-time Kitchen Display Systems (KDS), point-of-sale (POS), split billing, and multi-branch enterprise restaurant management.

---

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, Modular Monolith)
- **UI & Styling**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Code Quality**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

---

## Architecture Overview

DineFlow is structured as an extensible modular monolith within Next.js App Router, maintaining strict separation of concerns across logical boundaries:

```
DineFlow/
├── app/                  # Next.js App Router pages, layouts, and route handlers
│   ├── api/health/       # System health & database connectivity probe
│   ├── globals.css       # Tailwind CSS & design token definitions
│   ├── layout.tsx        # Root HTML layout and metadata
│   └── page.tsx          # Initial foundation screen
├── components/           # Reusable presentational interface components
├── docs/                 # Architectural and engineering documentation
│   ├── ARCHITECTURE.md   # Architectural patterns and isolation guarantees
│   ├── DATABASE.md       # Relational schema and multi-tenant modeling
│   ├── DEVELOPMENT.md    # Local setup and workflow guide
│   └── PHASE-ROADMAP.md  # Multi-phase product roadmap
├── features/             # Feature modules grouped by business capability
│   ├── auth/             # Authentication & user profile logic
│   └── tenant/           # Tenant onboarding & organization logic
├── lib/                  # Shared infrastructure utilities
│   ├── api-response.ts   # Standardized API response helpers
│   ├── db.ts             # Prisma client instance
│   ├── env.ts            # Type-safe environment variable validation
│   └── errors.ts         # Centralized domain and HTTP error classes
├── prisma/               # Database schema definition
│   └── schema.prisma     # Initial multi-tenant PostgreSQL schema
├── server/               # Server-only logic and secure database access
│   ├── db/client.ts      # Global Prisma singleton client
│   └── tenant/service.ts # Tenant query operations with isolation enforcement
├── types/                # Shared TypeScript definitions
├── validation/           # Zod validation schemas
├── .env.example          # Environment variable template with placeholders
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js compiler configuration
├── package.json          # Project scripts and dependencies
├── postcss.config.mjs    # PostCSS Tailwind plugin configuration
└── tsconfig.json         # Strict TypeScript compiler options
```

---

## Quick Start

### 1. Prerequisites

- **Node.js**: v20+ (v26 LTS verified)
- **npm**: v10+ (v11 verified)
- **PostgreSQL**: v14+ (Local, Docker, or managed cloud instance)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/maryammunir564-web/DineFlow.git
cd DineFlow
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local` and configure your database connection string:

```bash
cp .env.example .env.local
```

Edit `.env.local` to provide your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dineflow?schema=public"
```

### 4. Database Setup

Generate the Prisma Client:

```bash
npm run db:generate
```

Push schema to your database (when PostgreSQL is running):

```bash
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the foundation interface.

---

## Health & Diagnostics

A server-side health check endpoint is available at `/api/health`. It reports application uptime and probes database connectivity independently:

```bash
curl http://localhost:3000/api/health
```

Example response (with database connected):

```json
{
  "status": "ok",
  "timestamp": "2026-11-06T12:00:00.000Z",
  "version": "0.1.0",
  "environment": "development",
  "services": {
    "app": {
      "status": "healthy",
      "uptime": 45.2
    },
    "database": {
      "status": "connected",
      "latencyMs": 4
    }
  }
}
```

If the database is not configured or unreachable, the probe degrades gracefully and reports `"status": "degraded"` without crashing the server.

---

## Available Scripts

| Script                 | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Starts local Next.js development server with hot-reload |
| `npm run build`        | Compiles optimized production build with Turbopack      |
| `npm run start`        | Runs the compiled production build                      |
| `npm run lint`         | Runs ESLint validation across all source files          |
| `npm run type-check`   | Runs TypeScript compiler checks without emitting files  |
| `npm run format:check` | Checks code formatting with Prettier                    |
| `npm run format`       | Formats all source files with Prettier                  |
| `npm run db:generate`  | Generates typed Prisma Client from `schema.prisma`      |

---

## Documentation

- [Architecture & Design Principles](docs/ARCHITECTURE.md)
- [Database Schema & Data Isolation](docs/DATABASE.md)
- [Development Workflow Guide](docs/DEVELOPMENT.md)
- [Phase Roadmap](docs/PHASE-ROADMAP.md)

---

## License

Private & Proprietary — DineFlow Technologies.
