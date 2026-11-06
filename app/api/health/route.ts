import { NextResponse } from "next/server";
import { db } from "@/server/db/client";
import type { HealthCheckResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const startTime = Date.now();
  const uptime = process.uptime();
  const databaseUrl = process.env.DATABASE_URL;

  let dbStatus: "connected" | "unconfigured" | "unreachable" = "unconfigured";
  let dbLatency: number | undefined;
  let dbMessage: string | undefined;

  const isConfigured =
    databaseUrl &&
    !databaseUrl.includes("POSTGRES_USER") &&
    !databaseUrl.includes("POSTGRES_HOST") &&
    databaseUrl.trim() !== "";

  if (!isConfigured) {
    dbStatus = "unconfigured";
    dbMessage = "DATABASE_URL is not configured or uses placeholder template values.";
  } else {
    try {
      const probeStart = Date.now();
      // Execute a lightweight ping query
      await db.$queryRawUnsafe("SELECT 1");
      dbLatency = Date.now() - probeStart;
      dbStatus = "connected";
    } catch (error) {
      dbStatus = "unreachable";
      dbMessage =
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : "Database connection probe failed.";
    }
  }

  const overallStatus = dbStatus === "connected" ? "ok" : "degraded";

  const responseBody: HealthCheckResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: "0.1.0",
    environment: process.env.NODE_ENV ?? "development",
    services: {
      app: {
        status: "healthy",
        uptime: Math.round(uptime * 100) / 100,
      },
      database: {
        status: dbStatus,
        ...(dbLatency !== undefined ? { latencyMs: dbLatency } : {}),
        ...(dbMessage ? { message: dbMessage } : {}),
      },
    },
  };

  return NextResponse.json(responseBody, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
