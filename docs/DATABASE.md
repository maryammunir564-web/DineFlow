# DineFlow Database Foundation & Data Isolation

## 1. Overview

DineFlow uses **PostgreSQL** as its relational database and **Prisma ORM** as the type-safe data access layer.

The schema is architected to guarantee multi-tenancy, strict data isolation, role-based authorization, and branch-level scoping from day one.

---

## 2. Entity Relationship Diagram

```mermaid
erDiagram
    TENANT ||--o{ BRANCH : "operates"
    TENANT ||--o{ ROLE : "defines"
    TENANT ||--o{ MEMBERSHIP : "has"
    USER ||--o{ MEMBERSHIP : "holds"
    ROLE ||--o{ MEMBERSHIP : "grants"
    BRANCH ||--o{ BRANCH_MEMBERSHIP : "assigns"
    USER ||--o{ BRANCH_MEMBERSHIP : "works_at"
    MEMBERSHIP ||--o{ BRANCH_MEMBERSHIP : "scopes"

    TENANT {
        string id PK "UUID"
        string name "Restaurant Name"
        string slug UK "Subdomain / identifier"
        string description
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    BRANCH {
        string id PK "UUID"
        string tenantId FK "Tenant ID"
        string name "Branch Name"
        string code "Branch Code (e.g., DT-01)"
        string address
        string phone
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    USER {
        string id PK "UUID"
        string email UK "Normalized email"
        string name "Full Name"
        string phone "Phone Number"
        string avatarUrl
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    ROLE {
        string id PK "UUID"
        string tenantId FK "Nullable (global vs tenant-specific)"
        string name "Role Name"
        enum type "RoleType"
        string[] permissions "Extensible permission list"
        boolean isSystem
        datetime createdAt
        datetime updatedAt
    }

    MEMBERSHIP {
        string id PK "UUID"
        string tenantId FK "Tenant ID"
        string userId FK "User ID"
        string roleId FK "Role ID"
        enum status "MembershipStatus"
        datetime createdAt
        datetime updatedAt
    }

    BRANCH_MEMBERSHIP {
        string id PK "UUID"
        string branchId FK "Branch ID"
        string userId FK "User ID"
        string membershipId FK "Membership ID"
        boolean isPrimary
        datetime createdAt
        datetime updatedAt
    }
```

---

## 3. Core Domain Models

### `Tenant`

Represents the restaurant business or operating company.

- `id`: UUID primary key.
- `slug`: Unique slug for URL subdomains or path routing (e.g., `the-rustic-fork`).
- `isActive`: Allows soft-suspension of tenant accounts without deleting records.

### `Branch`

Represents a physical operating restaurant location under a tenant.

- Scoped to `tenantId` with composite uniqueness on `[tenantId, name]`.
- Enforces cascade deletion when a tenant is removed.

### `User`

Global platform user record.

- Identified by unique `email`.
- Users can belong to multiple tenants independently (e.g., an owner with two distinct restaurant brands, or staff working across separate establishments).

### `Role`

Defines permission sets for users within a tenant or across the platform.

- `type`: `SUPER_ADMIN`, `TENANT_OWNER`, `TENANT_ADMIN`, `BRANCH_MANAGER`, `KITCHEN_STAFF`, `WAITER`, `CASHIER`, `CUSTOM`.
- `permissions`: PostgreSQL string array (`String[]`) enabling fine-grained, extensible permissions (e.g., `["order:create", "kds:view", "bill:split"]`).
- `tenantId`: Nullable; `null` indicates platform-level system roles.

### `Membership`

The associative link establishing a User's participation in a Tenant with a specific Role.

- Composite uniqueness on `[tenantId, userId]` ensures a single membership record per user per tenant.
- Tracks membership state (`ACTIVE`, `INVITED`, `SUSPENDED`, `DEACTIVATED`).

### `BranchMembership`

Assigns a user to a specific operational branch.

- Links `branchId`, `userId`, and `membershipId`.
- Includes `isPrimary` flag for multi-branch staff assignment.

---

## 4. Multi-Tenant Isolation Strategy

1. **Mandatory Tenant Foreign Keys**: All tenant-owned records have a non-nullable `tenantId`.
2. **Server-Enforced Scoping**: All Prisma queries filter by `tenantId`.
3. **Compound Indexes**: High-frequency queries leverage composite indexes such as `@@index([tenantId, ...])` to guarantee indexed performance and isolation.
4. **Cascade Rules**:
   - Deleting a Tenant cascades to its Branches, Memberships, and Roles.
   - Deleting a Role is restricted (`onDelete: Restrict`) if active memberships hold that role.

---

## 5. Local Setup & Migrations

To apply this schema to your PostgreSQL database:

1. Provide your PostgreSQL connection in `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dineflow?schema=public"
   ```
2. Generate Prisma Client:
   ```bash
   npm run db:generate
   ```
3. Create and apply initial migration:
   ```bash
   npx prisma migrate dev --name init_phase1_foundation
   ```
4. Explore with Prisma Studio:
   ```bash
   npx prisma studio
   ```
