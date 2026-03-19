"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import LogCalendar from "./LogCalendar";

export type LogEntry = {
  id: string;
  date: Date;
  theme: string | null;
  peakPose: { name: string } | null;
};

interface LogListViewProps {
  logs: LogEntry[];
  onEntryClick?: (id: string) => void;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function LogListView({ logs, onEntryClick }: LogListViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date>(logs[0]?.date ?? new Date());
  const entryRefs = useRef<Record<string, HTMLElement | null>>({});

  const logDateKeys = new Set(logs.map((l) => toDateKey(l.date)));

  function handleDayClick(day: Date) {
    setSelectedDate(day);
    const key = toDateKey(day);
    const el = entryRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="flex flex-col md:grid md:grid-cols-[auto_1fr]">
      {/* Calendar panel */}
      <aside className="md:sticky md:top-[73px] md:self-start border-b md:border-b-0 md:border-r border-foreground/10 p-6">
        <LogCalendar
          logDateKeys={logDateKeys}
          selectedDate={selectedDate}
          month={month}
          onDayClick={handleDayClick}
          onMonthChange={setMonth}
        />
      </aside>

      {/* Journal list */}
      <section className="divide-y divide-foreground/10">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-center px-8">
            <p className="font-cormorant italic text-muted-foreground text-2xl">
              No entries yet
            </p>
            <p className="text-sm text-muted-foreground">
              Begin your first practice log
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const key = toDateKey(log.date);
            const isHighlighted = selectedDate && toDateKey(selectedDate) === key;

            return (
              <article
                key={log.id}
                ref={(el) => { entryRefs.current[key] = el; }}
                className={cn(
                  "transition-colors duration-300",
                  isHighlighted && "bg-accent/50"
                )}
              >
                <button
                  onClick={() => onEntryClick?.(log.id)}
                  className="block w-full text-left px-8 py-7 group"
                >
                  <time
                    dateTime={key}
                    className="block font-cormorant text-3xl font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors duration-300"
                  >
                    {formatDate(log.date)}
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
