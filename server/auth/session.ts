import { createHash, randomBytes } from "crypto";
import { db } from "@/server/db/client";
import type { Session, User } from "@prisma/client";

export const SESSION_COOKIE_NAME = "dineflow_session";
export const SESSION_MAX_AGE_DAYS = 30;

/**
 * Creates a cryptographically secure random session token.
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Computes a SHA-256 hash of the raw token for safe persistence.
 */
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface SessionWithUser {
  session: Session;
  user: User;
}

/**
 * Creates and persists a new session in the database.
 */
export async function createSession(
  userId: string,
  meta?: { ipAddress?: string; userAgent?: string },
): Promise<{ rawToken: string; session: Session }> {
  const rawToken = generateSessionToken();
  const sessionToken = hashSessionToken(rawToken);

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_MAX_AGE_DAYS);

  const session = await db.session.create({
    data: {
      sessionToken,
      userId,
      expiresAt,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    },
  });

  return { rawToken, session };
}

/**
 * Validates a session token and returns the session & associated user if valid.
 */
export async function validateSession(rawToken: string): Promise<SessionWithUser | null> {
  const sessionToken = hashSessionToken(rawToken);

  const record = await db.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!record) {
    return null;
  }

  // Check if session expired
  if (Date.now() >= record.expiresAt.getTime()) {
    await db.session.delete({ where: { id: record.id } }).catch(() => null);
    return null;
  }

  // Check if user is active
  if (!record.user.isActive) {
    return null;
  }

  // Sliding window extension: extend session if more than 15 days have elapsed
  const fifteenDaysInMs = 1000 * 60 * 60 * 24 * 15;
  if (Date.now() >= record.expiresAt.getTime() - fifteenDaysInMs) {
    record.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_MAX_AGE_DAYS);
    await db.session
      .update({
        where: { id: record.id },
        data: { expiresAt: record.expiresAt },
      })
      .catch(() => null);
  }

  return {
    session: record,
    user: record.user,
  };
}

/**
 * Revokes an active session.
 */
export async function invalidateSession(rawToken: string): Promise<void> {
  const sessionToken = hashSessionToken(rawToken);
  await db.session.deleteMany({
    where: { sessionToken },
  });
}

/**
 * Revokes all active sessions for a user (e.g. on password reset or security revocation).
 */
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await db.session.deleteMany({
    where: { userId },
  });
}
