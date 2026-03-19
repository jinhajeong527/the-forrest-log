"use client";

import { Calendar } from "@/components/ui/calendar";

interface LogCalendarProps {
  logDateKeys: Set<string>;
  selectedDate: Date | undefined;
  month: Date;
  onDayClick: (day: Date) => void;
  onMonthChange: (month: Date) => void;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function LogCalendar({
  logDateKeys,
  selectedDate,
  month,
  onDayClick,
  onMonthChange,
}: LogCalendarProps) {
  return (
    <div className="rounded-sm border-2 p-1">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(day) => day && onDayClick(day)}
        month={month}
        onMonthChange={onMonthChange}
        className="[--cell-size:--spacing(14)]"
        modifiers={{
          hasLog: (day) => logDateKeys.has(toDateKey(day)),
        }}
        modifiersClassNames={{
          hasLog: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
          selected: "!bg-primary !text-primary-foreground rounded-sm",
        }}
        classNames={{
          // Preserve default layout (flex, height, padding for nav overlap) + add typography
          month_caption: "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size) font-cormorant text-xl font-semibold tracking-wide",
          day: "h-(--cell-size) w-(--cell-size) rounded-sm transition-colors hover:bg-accent text-sm",
          today: "font-bold text-primary",
        }}
      />
    </div>
  );
}
