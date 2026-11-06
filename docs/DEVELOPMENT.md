# DineFlow Development Guide

This guide details everything required to set up, develop, and test DineFlow locally.

---

## 1. Prerequisites

Before starting, ensure your local development environment has:

| Tool           | Recommended Version | Minimum Version | Note                |
| -------------- | ------------------- | --------------- | ------------------- |
| **Node.js**    | v26 LTS / v22 LTS   | v20.0.0         | JavaScript runtime  |
| **npm**        | v11+ / v12          | v10.0.0         | Package manager     |
| **Git**        | v2.40+              | v2.25.0         | Version control     |
| **PostgreSQL** | v16+                | v14.0.0         | Relational database |

On Windows, use `npm.cmd` and `npx.cmd` in PowerShell if script execution policies prevent `.ps1` execution.

---

## 2. Initial Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/maryammunir564-web/DineFlow.git
cd DineFlow
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Copy `.env.example` to create your local `.env.local`:

```bash
cp .env.example .env.local
```

Configure your local PostgreSQL connection in `.env.local`:

```env
# Example local PostgreSQL URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dineflow?schema=public"
```

> **Security Note**: Never commit `.env.local` or any files containing actual passwords, API tokens, or secrets. `.gitignore` is configured to exclude all `.env` files except `.env.example`.

### Step 4: Generate Prisma Client

```bash
npm run db:generate
```

### Step 5: Initialize Database (when PostgreSQL is running)

```bash
npx prisma db push
```

---

## 3. Development Workflow

### Starting the Local Development Server

```bash
npm run dev
```

The server will start on [http://localhost:3000](http://localhost:3000).

### Running Quality Checks

Run all validation scripts before committing any code:

```bash
# 1. Type Checking
npm run type-check

# 2. ESLint
npm run lint

# 3. Prettier Format Verification
npm run format:check

# 4. Automatic Formatting
npm run format

# 5. Production Build
npm run build
```

---

## 4. Health Check Probe Verification

DineFlow provides a health check endpoint at `/api/health` to verify system status and database reachability:

```bash
# Using curl
curl http://localhost:3000/api/health

# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/health"
```

The response indicates:

- Overall status (`"ok"` or `"degraded"`)
- Application status & process uptime
- Database connectivity state (`"connected"`, `"unconfigured"`, or `"unreachable"`) with query latency in milliseconds

---

## 5. Coding Standards & Conventions

- **TypeScript Strict Mode**: No implicit `any`, strict null checks enabled.
- **Next.js App Router**: Route handlers inside `app/api/**/route.ts`, layouts inside `app/**/layout.tsx`.
- **Validation**: All external inputs (route params, query params, request bodies) must be validated with Zod schemas in `validation/`.
- **Error Handling**: Throw typed errors from `lib/errors.ts` and return standard responses using `lib/api-response.ts`.
- **Server Boundaries**: Database queries and Prisma models must remain in `server/` or server components; never expose them to client components.
