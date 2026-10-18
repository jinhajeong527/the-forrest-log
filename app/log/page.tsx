import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { withUser } from "@/lib/prisma-user";
import LogPageContainer from "@/components/log/LogPageContainer";

export default async function LogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [rawLogs, poses] = await withUser(user.id, (tx) => Promise.all([
    tx.practiceLog.findMany({
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

  return <LogPageContainer logs={logs} poses={poses} />;
}
