import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import LogPageContainer from "@/components/log/LogPageContainer";

export default async function LogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [rawLogs, poses] = await Promise.all([
    prisma.practiceLog.findMany({
      where: { userId: user.id },
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
    prisma.pose.findMany({
      select: { id: true, name: true, imageUrl: true, categories: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const logs = rawLogs.map((l) => ({
    ...l,
    sequence: l.sequenceLogs.map((s) => ({
      poseId: s.poseId,
      name: s.pose.name,
      imageUrl: s.pose.imageUrl,
      order: s.order,
    })),
  }));

  return <LogPageContainer logs={logs} poses={poses} />;
}
