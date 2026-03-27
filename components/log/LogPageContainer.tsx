"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import LogCalendar from "@/components/log/LogCalendar";
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
};

export type PoseOption = { id: string; name: string; imageUrl: string | null; categories: string[] };

type PanelMode = "list" | "create" | "view" | "edit";

interface LogPageContainerProps {
  logs: FullLogEntry[];
  poses: PoseOption[];
}

function toDateKey(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

export default function LogPageContainer({ logs, poses }: LogPageContainerProps) {
  const [panelMode, setPanelMode] = useState<PanelMode>("list");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  const selectedLog = logs.find((l) => l.id === selectedLogId) ?? null;
  const logDateKeys = new Set(logs.map((l) => toDateKey(l.date)));

  const handleSuccess = useCallback(() => {
    setPanelMode("list");
    setSelectedLogId(null);
    router.refresh();
  }, [router]);

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
  }, [panelMode, selectedLog]);

  function handleCalendarDayClick(date: Date) {
    const key = toDateKey(date);
    const isSameDate = selectedDate && toDateKey(selectedDate) === key;
    if (isSameDate) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
      if (panelMode !== "list") setPanelMode("list");
    }
  }

  function handleClearDate() {
    setSelectedDate(null);
  }

  const initialDate = selectedDate
    ? toDateKey(selectedDate)
    : toDateKey(new Date());

  return (
    <div className="flex flex-col h-dvh bg-background">
      <PageHeader title="Practice Log" />

      {/* Split view: calendar (left) + panel (right) */}
      <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full">
        {/* Left: Calendar panel — hidden on mobile */}
        <aside className="shrink-0 border-r border-foreground/10 p-6 overflow-y-auto hidden md:block">
          <LogCalendar
            logDateKeys={logDateKeys}
            selectedDate={selectedDate}
            month={calendarMonth}
            onDayClick={handleCalendarDayClick}
            onMonthChange={setCalendarMonth}
          />
        </aside>

        {/* Right: Content panel */}
        <section className="flex-1 overflow-y-auto">
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
        </section>
      </div>
    </div>
  );
}
