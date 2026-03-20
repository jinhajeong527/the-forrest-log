"use client";

import { cn } from "@/lib/utils";
import { ForrestButton } from "@/components/common/ForrestButton";
import { PanelHeader } from "@/components/common/PanelHeader";

export type LogEntry = {
  id: string;
  date: Date;
  theme: string | null;
  peakPose: { name: string } | null;
};

interface LogListViewProps {
  logs: LogEntry[];
  selectedDate: Date | null;
  onClearDate: () => void;
  onNewLog: () => void;
  onEntryClick?: (id: string) => void;
}

function toDateKey(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

function formatEntryDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatFilterDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LogListView({
  logs,
  selectedDate,
  onClearDate,
  onNewLog,
  onEntryClick,
}: LogListViewProps) {
  const filteredLogs = selectedDate
    ? logs.filter((l) => toDateKey(l.date) === toDateKey(selectedDate))
    : logs;

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <PanelHeader
        left={
          selectedDate ? (
            <button
              onClick={onClearDate}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm border border-primary/30 bg-primary/5 text-xs text-primary hover:bg-primary/10 transition-colors"
            >
              {formatFilterDate(selectedDate)}
              <span aria-hidden="true">✕</span>
              <span className="sr-only">Clear date filter</span>
            </button>
          ) : (
            <span className="inline-flex items-center px-3 py-1 border border-transparent text-xs text-muted-foreground">
              All practices
            </span>
          )
        }
        right={
          <ForrestButton size="sm" onClick={onNewLog}>
            + New Log
          </ForrestButton>
        }
      />

      {/* Log entries */}
      <section className="divide-y divide-foreground/10 flex-1">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-center px-8">
            <p className="font-cormorant italic text-muted-foreground text-2xl">
              {selectedDate ? "No entry for this day" : "No entries yet"}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedDate
                ? "Begin a new entry for this date"
                : "Begin your first practice log"}
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const key = toDateKey(log.date);
            return (
              <article key={log.id}>
                <button
                  onClick={() => onEntryClick?.(log.id)}
                  className={cn(
                    "block w-full text-left px-8 py-7 group",
                    "transition-colors duration-200 hover:bg-accent/40"
                  )}
                >
                  <time
                    dateTime={key}
                    className="block font-cormorant text-3xl font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors duration-300"
                  >
                    {formatEntryDate(log.date)}
                  </time>
                  {log.theme && (
                    <p className="mt-1 text-sm text-foreground/70">{log.theme}</p>
                  )}
                  {log.peakPose && (
                    <p className="mt-0.5 text-xs text-muted-foreground italic">
                      Peak · {log.peakPose.name}
                    </p>
                  )}
                </button>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
