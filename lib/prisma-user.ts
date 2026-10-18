import { z } from "zod";
import type { Prisma } from "./generated/prisma/client";
import { prisma } from "./prisma";

// userId must come from server-verified authentication, never request input.
export async function withUser<T>(
  userId: string,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  const id = z.uuid().parse(userId);
  return prisma.$transaction(async (tx) => {
    // Transaction-local settings expire on commit/rollback with pooled connections.
    await tx.$queryRaw`
      SELECT set_config('request.jwt.claim.sub', ${id}, true),
             set_config('request.jwt.claims', ${JSON.stringify({ sub: id })}, true)
    `;
    return operation(tx);
  });
}
