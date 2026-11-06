import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPracticeLogPageData } from "./queries";
import LogPageContainer from "@/components/log/LogPageContainer";
import LogCalendarSkeleton from "@/components/log/LogCalendarSkeleton";
import LogListLoading from "@/components/log/LogListLoading";

export default function LogPage() {
  return (
    <Suspense fallback={<LogPageLoading />}>
      <LogPageContent />
    </Suspense>
  );
}

async function LogPageContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dataPromise = getPracticeLogPageData(user.id);

  return <LogPageContainer dataPromise={dataPromise} />;
}

function LogPageLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full">
        <aside
          aria-hidden="true"
          className="shrink-0 border-r border-foreground/10 p-6 overflow-y-auto hidden md:block"
        >
          <LogCalendarSkeleton />
        </aside>
        <section className="flex-1 overflow-y-auto">
          <LogListLoading />
        </section>
      </div>
    </div>
  );
}
