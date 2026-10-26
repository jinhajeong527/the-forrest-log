import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPracticeLogPageData } from "./queries";
import LogPageContainer from "@/components/log/LogPageContainer";

export default async function LogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dataPromise = getPracticeLogPageData(user.id);

  return <LogPageContainer dataPromise={dataPromise} />;
}
