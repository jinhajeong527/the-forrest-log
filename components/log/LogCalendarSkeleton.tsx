"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getCurrentMonthWeekCount() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Math.ceil((firstWeekday + daysInMonth) / 7);
}

export default function LogCalendarSkeleton() {
  const weekCount = useSyncExternalStore(subscribe, getCurrentMonthWeekCount, () => 5);

  return (
    <div className="rounded-sm border-2 p-4">
      <div className="mb-4 flex h-14 items-center justify-center">
        <div className="h-4 w-28 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-7 text-[0.8rem]">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="flex w-14 items-center justify-center">
            <span className="invisible">Su</span>
            <span className="absolute h-2 w-4 rounded bg-muted" />
          </div>
        ))}
      </div>
      {Array.from({ length: weekCount }, (_, week) => (
        <div key={week} className="mt-2 grid grid-cols-7">
          {Array.from({ length: 7 }, (_, day) => (
            <div key={day} className="flex size-14 items-center justify-center">
              <div className="size-3 rounded bg-muted" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
