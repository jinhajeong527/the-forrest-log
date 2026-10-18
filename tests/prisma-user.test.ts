import assert from "node:assert/strict";
import { test } from "node:test";
import { prisma } from "../lib/prisma";
import { withUser } from "../lib/prisma-user";

const userId = "11111111-1111-4111-8111-111111111111";

test("withUser validates identity and sets local parameterized context before queries", async () => {
  const original = prisma.$transaction;
  const calls: unknown[][] = [];
  const tx = {
    $queryRaw: async (strings: TemplateStringsArray, ...values: unknown[]) => {
      calls.push([strings.join("?"), ...values]);
    },
  };
  prisma.$transaction = (async (operation: (client: typeof tx) => Promise<unknown>) => {
    return operation(tx);
  }) as typeof prisma.$transaction;
  try {
    await assert.rejects(withUser("untrusted-input", async () => 0));
    assert.equal(calls.length, 0);
    const result = await withUser(userId, async (client) => {
      assert.equal(client, tx);
      assert.equal(calls.length, 1);
      return 42;
    });
    assert.equal(result, 42);
    assert.deepEqual(calls[0].slice(1), [userId, JSON.stringify({ sub: userId })]);
    assert.match(String(calls[0][0]), /request\.jwt\.claim\.sub[\s\S]*\?, true/);
    assert.match(String(calls[0][0]), /request\.jwt\.claims[\s\S]*\?, true/);
    await assert.rejects(withUser(userId, async () => { throw new Error("operation failed"); }), /operation failed/);
  } finally {
    prisma.$transaction = original;
    await prisma.$disconnect();
  }
});
