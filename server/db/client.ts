import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global `var` declarations in TypeScript
  var __dineflowPrismaClient: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const db: PrismaClient = globalThis.__dineflowPrismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__dineflowPrismaClient = db;
}

export default db;
