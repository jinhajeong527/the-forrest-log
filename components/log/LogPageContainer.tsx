"use client";

import { Suspense, use, useState, useTransition, useCallback, useEffect } from "react";
import type { ComponentProps, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import LogCalendar from "@/components/log/LogCalendar";
import LogListLoading from "@/components/log/LogListLoading";
import LogListView from "@/components/log/LogListView";
import PracticeLogForm from "@/components/log/PracticeLogForm";
import LogDetailView from "@/components/log/LogDetailView";
import {
  createPracticeLog,
  updatePracticeLog,
  deletePracticeLog,
} from "@/app/log/actions";
import { type Prop } from "@/lib/generated/prisma/client";

export type FullLogEntry = {
  id: string;
  date: Date;
  theme: string | null;
  peakPoseId: string | null;
  peakPose: { id: string; name: string; imageUrl: string | null } | null;
  conditionBefore: number | null;
  conditionAfter: number | null;
  props: Prop[];
  notes: string | null;
  sequence: { poseId: string; name: string; imageUrl: string | null; order: number }[];
};

export type PoseOption = { id: string; name: string; imageUrl: string | null; categories: string[] };

type PanelMode = "list" | "create" | "view" | "edit";

type LogData = { logs: FullLogEntry[]; poses: PoseOption[] };

interface LogPageContainerProps {
  dataPromise: Promise<LogData>;
}

interface LogContentProps extends LogPageContainerProps {
  selectedDate: Date | null;
  setSelectedDate: Dispatch<SetStateAction<Date | null>>;
  panelMode: PanelMode;
  setPanelMode: Dispatch<SetStateAction<PanelMode>>;
}

function toDateKey(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

export default function LogPageContainer({ dataPromise }: LogPageContainerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [panelMode, setPanelMode] = useState<PanelMode>("list");

  function handleCalendarDayClick(date: Date) {
    const isSameDate = selectedDate && toDateKey(selectedDate) === toDateKey(date);
    setSelectedDate(isSameDate ? null : date);
    if (!isSameDate) setPanelMode("list");
  }

  const calendarProps = {
    selectedDate,
    month: calendarMonth,
    onDayClick: handleCalendarDayClick,
    onMonthChange: setCalendarMonth,
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full">
        <aside className="shrink-0 border-r border-foreground/10 p-6 overflow-y-auto hidden md:block">
          <Suspense fallback={<LogCalendar {...calendarProps} logDateKeys={new Set<string>()} />}>
            <CalendarWithData {...calendarProps} dataPromise={dataPromise} />
          </Suspense>
        </aside>
        <section className="flex-1 overflow-y-auto">
          <Suspense fallback={<LogListLoading />}>
            <LogContent
              dataPromise={dataPromise}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              panelMode={panelMode}
              setPanelMode={setPanelMode}
            />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

function CalendarWithData({ dataPromise, ...props }: LogPageContainerProps & Omit<ComponentProps<typeof LogCalendar>, "logDateKeys">) {
  const { logs } = use(dataPromise);
  const logDateKeys = new Set(logs.map((log) => toDateKey(log.date)));
  return <LogCalendar {...props} logDateKeys={logDateKeys} />;
}

function LogContent({ dataPromise, selectedDate, setSelectedDate, panelMode, setPanelMode }: LogContentProps) {
  const { logs, poses } = use(dataPromise);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  const selectedLog = logs.find((l) => l.id === selectedLogId) ?? null;

  const handleSuccess = useCallback(() => {
    setPanelMode("list");
    setSelectedLogId(null);
    router.refresh();
  }, [router, setPanelMode]);

  function handleEntryClick(id: string) {
    setSelectedLogId(id);
    setPanelMode("view");
  }

  function handleNewLog() {
    setSelectedLogId(null);
    setPanelMode("create");
  }

  function handleDelete(id: string) {
    setDeleteError(null);
    startDeleteTransition(async () => {
      try {
        await deletePracticeLog(id);
        handleSuccess();
      } catch {
        setDeleteError("Failed to delete entry. Please try again.");
      }
    });
  }

  useEffect(() => {
    if (panelMode === "view" && !selectedLog) setPanelMode("list");
  }, [panelMode, selectedLog, setPanelMode]);

  function handleClearDate() {
    setSelectedDate(null);
  }

  const initialDate = selectedDate
    ? toDateKey(selectedDate)
    : toDateKey(new Date());

  return (
    <>
          {panelMode === "list" && (
            <LogListView
              logs={logs}
              selectedDate={selectedDate}
              onClearDate={handleClearDate}
              onNewLog={handleNewLog}
              onEntryClick={handleEntryClick}
            />
          )}
          {panelMode === "create" && (
            <PracticeLogForm
              mode="create"
              action={createPracticeLog}
              poses={poses}
              initialDate={initialDate}
              onSuccess={handleSuccess}
              onCancel={() => setPanelMode("list")}
            />
          )}
          {panelMode === "view" && selectedLog && (
            <LogDetailView
              log={selectedLog}
              onEdit={() => setPanelMode("edit")}
              onDelete={handleDelete}
              onBack={() => setPanelMode("list")}
              isDeleting={isDeleting}
              deleteError={deleteError}
            />
          )}
          {panelMode === "edit" && selectedLog && (
            <PracticeLogForm
              mode="edit"
              action={updatePracticeLog}
              poses={poses}
              defaultValues={selectedLog}
              onSuccess={handleSuccess}
              onCancel={() => setPanelMode("view")}
            />
          )}
    </>
  );
}
