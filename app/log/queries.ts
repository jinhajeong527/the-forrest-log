import "server-only";
import { withUser } from "@/lib/prisma-user";

export async function getPracticeLogPageData(userId: string) {
  const [rawLogs, poses] = await withUser(userId, (tx) => Promise.all([
    tx.practiceLog.findMany({
      where: { userId },
      select: {
        id: true,
        date: true,
        theme: true,
        peakPoseId: true,
        peakPose: { select: { id: true, name: true, imageUrl: true } },
        conditionBefore: true,
        conditionAfter: true,
        props: true,
        notes: true,
        sequenceLogs: {
          select: {
            poseId: true,
            order: true,
            pose: { select: { name: true, imageUrl: true } },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { date: "desc" },
    }),
    tx.pose.findMany({
      select: { id: true, name: true, imageUrl: true, categories: true },
      orderBy: { name: "asc" },
    }),
  ]));

  const logs = rawLogs.map(({ sequenceLogs, ...rest }) => ({
    ...rest,
    sequence: sequenceLogs.map((s) => ({
      poseId: s.poseId,
      name: s.pose.name,
      imageUrl: s.pose.imageUrl,
      order: s.order,
    })),
  }));

  return { logs, poses };
}
