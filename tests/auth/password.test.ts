import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../../server/auth/password.ts";

test("Password Security - hashPassword generates valid versioned hash", async () => {
  const password = "CorrectHorseBatteryStaple123!";
  const hash = await hashPassword(password);

  assert.ok(typeof hash === "string", "Hash should be a string");
  assert.ok(
    hash.startsWith("v1$N=16384,r=8,p=1$"),
    "Hash should start with version and scrypt params",
  );

  const parts = hash.split("$");
  assert.strictEqual(parts.length, 4, "Hash should contain 4 $-delimited parts");
  assert.strictEqual(parts[0], "v1");
  assert.strictEqual(parts[1], "N=16384,r=8,p=1");
  assert.strictEqual(parts[2].length, 32, "Salt should be 16 bytes (32 hex characters)");
  assert.strictEqual(parts[3].length, 128, "Key should be 64 bytes (128 hex characters)");
});

test("Password Security - verifyPassword validates correct password", async () => {
  const password = "SuperSecretPassword#2026";
  const hash = await hashPassword(password);

  const isValid = await verifyPassword(password, hash);
  assert.strictEqual(isValid, true, "Valid password should verify successfully");
});

test("Password Security - verifyPassword rejects incorrect password", async () => {
  const password = "SuperSecretPassword#2026";
  const wrongPassword = "WrongPassword#2026";
  const hash = await hashPassword(password);

  const isValid = await verifyPassword(wrongPassword, hash);
  assert.strictEqual(isValid, false, "Wrong password should be rejected");
});

test("Password Security - identical passwords produce distinct hashes due to random salts", async () => {
  const password = "IdenticalPasswordForSaltCheck";
  const hash1 = await hashPassword(password);
  const hash2 = await hashPassword(password);

  assert.notStrictEqual(
    hash1,
    hash2,
    "Two hashes of the same password must differ due to unique salts",
  );

  const isValid1 = await verifyPassword(password, hash1);
  const isValid2 = await verifyPassword(password, hash2);
  assert.strictEqual(isValid1, true);
  assert.strictEqual(isValid2, true);
});

test("Password Security - rejects invalid or malformed stored hashes safely", async () => {
  const password = "TestPassword";

  // Completely corrupt strings
  assert.strictEqual(await verifyPassword(password, ""), false);
  assert.strictEqual(await verifyPassword(password, "random-garbage-string"), false);
  assert.strictEqual(await verifyPassword(password, "v2$N=16384,r=8,p=1$salt$hash"), false);
  assert.strictEqual(await verifyPassword(password, "v1$invalidparams$salt$hash"), false);
  assert.strictEqual(await verifyPassword(password, "v1$N=16384,r=8,p=1$nothex$nothex"), false);

  // Truncated hash
  assert.strictEqual(
    await verifyPassword(password, "v1$N=16384,r=8,p=1$1234567890abcdef$123456"),
    false,
  );
});

test("Password Security - safe handling of invalid inputs", async () => {
  // Empty password for hashPassword should throw
  await assert.rejects(
    async () => {
      await hashPassword("");
    },
    {
      message: "Password must be a non-empty string",
    },
  );

  // Non-string inputs for hashPassword should throw
  await assert.rejects(
    async () => {
      // @ts-expect-error Testing invalid runtime input
      await hashPassword(null);
    },
    {
      message: "Password must be a non-empty string",
    },
  );

  // Invalid inputs for verifyPassword should safely return false without throwing
  // @ts-expect-error Testing invalid runtime input
  assert.strictEqual(await verifyPassword(null, "somehash"), false);
  // @ts-expect-error Testing invalid runtime input
  assert.strictEqual(await verifyPassword("password", null), false);
  // @ts-expect-error Testing invalid runtime input
  assert.strictEqual(await verifyPassword(undefined, undefined), false);
});
