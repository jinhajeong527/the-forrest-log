import assert from "node:assert/strict";
import { test } from "node:test";
import { isRlsViolation } from "./rls-error";

const cause = {
  originalCode: "42501",
  originalMessage: 'new row violates row-level security policy for table "practice_logs"',
};

test("recognizes RLS violations from driver and Prisma wrappers", () => {
  assert.ok(isRlsViolation({ cause }, "practice_logs"));
  assert.ok(isRlsViolation({ meta: { driverAdapterError: { cause } } }, "practice_logs"));
});

test("rejects connection failures, other permission errors, constraints and wrong tables", () => {
  assert.equal(isRlsViolation(new Error("connection refused"), "practice_logs"), false);
  assert.equal(isRlsViolation({ cause: { ...cause, originalMessage: "permission denied for table practice_logs" } }, "practice_logs"), false);
  assert.equal(isRlsViolation({ cause: { ...cause, originalCode: "23503" } }, "practice_logs"), false);
  assert.equal(isRlsViolation({ cause }, "sequence_logs"), false);
  assert.equal(isRlsViolation(null, "practice_logs"), false);
});
