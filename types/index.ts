export type TenantId = string;
export type BranchId = string;
export type UserId = string;

export interface TenantContext {
  tenantId: TenantId;
  slug: string;
  name: string;
}

export interface UserContext {
  userId: UserId;
  email: string;
  name?: string | null;
  role: string;
  permissions: string[];
}

export interface HealthCheckResponse {
  status: "ok" | "degraded";
  timestamp: string;
  version: string;
  environment: string;
  services: {
    app: {
      status: "healthy";
      uptime: number;
    };
    database: {
      status: "connected" | "unconfigured" | "unreachable";
      latencyMs?: number;
      message?: string;
    };
  };
}
