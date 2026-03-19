import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/common/PageHeader";
import LogListView from "@/components/log/LogListView";

export default async function LogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const logs = await prisma.practiceLog.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      date: true,
      theme: true,
      peakPose: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });

  return (
    <main className="min-h-screen bg-background">
      <PageHeader title="Practice Log" />
      <div className="max-w-5xl mx-auto">
        <LogListView logs={logs} />
      </div>
    </main>
  );
}
