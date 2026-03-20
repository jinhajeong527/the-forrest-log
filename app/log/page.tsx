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

  const [logs, poses] = await Promise.all([
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
      },
      orderBy: { date: "desc" },
    }),
    prisma.pose.findMany({
      select: { id: true, name: true, imageUrl: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return <LogPageContainer logs={logs} poses={poses} />;
}
