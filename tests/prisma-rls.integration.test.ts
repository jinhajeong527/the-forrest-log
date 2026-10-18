import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { isRlsViolation } from "./rls-error";

// Explicitly opt in with a dedicated migrated test database and restricted login.
const url = process.env.RLS_TEST_DATABASE_URL;
test("restricted runtime enforces two-user RLS and clears pooled context", { skip: !url }, async () => {
  if (!url) throw new Error("RLS_TEST_DATABASE_URL is required");
  process.env.DATABASE_URL = url;
  const { prisma } = await import("../lib/prisma");
  const { withUser } = await import("../lib/prisma-user");
  const a = randomUUID();
  const b = randomUUID();
  const logA = randomUUID();
  const logB = randomUUID();
  const sequenceId = randomUUID();
  // A dedicated fixture pose must be supplied: restricted runtime cannot create poses.
  const pose = await prisma.pose.findFirst({ select: { id: true } });
  assert.ok(pose, "Seed at least one pose in the test database");
  try {
    const roles = await prisma.$queryRaw<Array<{ unsafe: boolean }>>`
      SELECT (r.rolsuper OR r.rolbypassrls OR EXISTS (
        SELECT 1 FROM pg_class c WHERE c.oid IN
        ('public.practice_logs'::regclass, 'public.sequence_logs'::regclass)
        AND (c.relowner = r.oid OR NOT c.relrowsecurity)
      )) AS unsafe FROM pg_roles r WHERE r.rolname = current_user`;
    assert.equal(roles[0].unsafe, false, "Use a restricted non-owner role with RLS enabled");
    await withUser(a, tx => tx.practiceLog.create({ data: { id: logA, userId: a, date: new Date() } }));
    await withUser(b, tx => tx.practiceLog.create({ data: { id: logB, userId: b, date: new Date() } }));
    await withUser(a, async tx => {
      const rows = await tx.practiceLog.findMany(); // Intentionally no ownership filter.
      assert.ok(rows.some(row => row.id === logA));
      assert.ok(rows.every(row => row.userId === a));
      assert.equal((await tx.practiceLog.updateMany({ where: { id: logB }, data: { notes: "forbidden" } })).count, 0);
      assert.equal((await tx.practiceLog.deleteMany({ where: { id: logB } })).count, 0);
      await tx.practiceLog.update({ where: { id: logA }, data: { notes: "allowed" } });
      await tx.sequenceLog.create({ data: { id: sequenceId, practiceLogId: logA, poseId: pose.id, order: 1 } });
    });
    // PostgreSQL generates the ID when B creates their sequence entry.
    const bSequence = await withUser(b, tx => tx.sequenceLog.create({
      data: { practiceLogId: logB, poseId: pose.id, order: 1, notes: "B original" },
    }));
    const bSequenceId = bSequence.id;

    await withUser(a, async tx => {
      const sequences = await tx.sequenceLog.findMany(); // No ownership filter.
      assert.ok(sequences.some(row => row.id === sequenceId));
      assert.ok(sequences.every(row => row.practiceLogId === logA));
      assert.equal((await tx.sequenceLog.findMany({ where: { id: bSequenceId } })).length, 0);
      assert.equal((await tx.sequenceLog.updateMany({
        where: { id: bSequenceId }, data: { notes: "forbidden" },
      })).count, 0);
      assert.equal((await tx.sequenceLog.deleteMany({ where: { id: bSequenceId } })).count, 0);
    });

    // B can still read the untouched row after A's attempted operations.
    await withUser(b, async tx => {
      const unchanged = await tx.sequenceLog.findUniqueOrThrow({ where: { id: bSequenceId } });
      assert.deepEqual(unchanged, bSequence);
    });
    await assert.rejects(withUser(a, tx => tx.practiceLog.create({ data: { userId: b, date: new Date() } })), (error: unknown) => isRlsViolation(error, "practice_logs"));
    await assert.rejects(withUser(a, tx => tx.practiceLog.update({ where: { id: logA }, data: { userId: b } })), (error: unknown) => isRlsViolation(error, "practice_logs"));
    await assert.rejects(withUser(a, tx => tx.sequenceLog.update({ where: { id: sequenceId }, data: { practiceLogId: logB } })), (error: unknown) => isRlsViolation(error, "sequence_logs"));
    await assert.rejects(withUser(a, tx => tx.sequenceLog.create({ data: { practiceLogId: logB, poseId: pose.id, order: 1 } })), (error: unknown) => isRlsViolation(error, "sequence_logs"));
    await assert.rejects(withUser(a, async () => { throw new Error("rollback"); }), /rollback/);
    await Promise.all(Array.from({ length: 8 }, (_, i) => withUser(i % 2 ? a : b, async tx => {
      const rows = await tx.practiceLog.findMany();
      assert.ok(rows.length > 0);
      assert.ok(rows.every(row => row.userId === (i % 2 ? a : b)));
    })));
    assert.equal((await prisma.practiceLog.findMany()).length, 0);
    assert.equal((await prisma.practiceLog.updateMany({ where: { id: { in: [logA, logB] } }, data: { notes: "forbidden" } })).count, 0);
    assert.equal((await prisma.practiceLog.deleteMany({ where: { id: { in: [logA, logB] } } })).count, 0);
    await assert.rejects(prisma.practiceLog.create({ data: { userId: a, date: new Date() } }), (error: unknown) => isRlsViolation(error, "practice_logs"));
  } finally {
    for (const [userId, id] of [[a, logA], [b, logB]]) {
      await withUser(userId, async tx => {
        await tx.sequenceLog.deleteMany({ where: { practiceLogId: id } });
        await tx.practiceLog.deleteMany({ where: { id } });
      });
    }
    await prisma.$disconnect();
  }
});
