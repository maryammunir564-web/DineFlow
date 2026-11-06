import { db } from "@/server/db/client";
import { NotFoundError, TenantIsolationError } from "@/lib/errors";
import type { Tenant, Branch } from "@prisma/client";

/**
 * Server-only service providing tenant data access with strict tenant isolation.
 * Authorization rules verify tenant context before query execution.
 */
export async function getTenantById(tenantId: string): Promise<Tenant> {
  if (!tenantId) {
    throw new TenantIsolationError("Tenant identifier is required");
  }

  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new NotFoundError("Tenant", tenantId);
  }

  return tenant;
}

/**
 * Retrieves branches strictly scoped to the authorized tenant ID.
 */
export async function getTenantBranches(tenantId: string): Promise<Branch[]> {
  if (!tenantId) {
    throw new TenantIsolationError("Tenant identifier is required");
  }

  return db.branch.findMany({
    where: {
      tenantId,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}
