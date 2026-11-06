import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getPoses() {
  "use cache";
  cacheLife("days");
  cacheTag("poses");

  // Playwright counts this marker to verify pose cache reuse.
  if (process.env.E2E_POSE_CACHE_PROBE === "1") {
    console.log("[poses] DB query");
  }
  return prisma.pose.findMany({
    select: { id: true, name: true, imageUrl: true, categories: true },
    orderBy: { imageUrl: "asc" },
  });
}
