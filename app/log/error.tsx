"use client";

import { ForrestButton } from "@/components/common/ForrestButton";

export default function LogError({ retry }: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 pt-32 text-center">
      <p role="alert" className="text-muted-foreground">
        We couldn’t load your practice logs. Please try again.
      </p>
      <ForrestButton onClick={() => retry()}>
        Try again
      </ForrestButton>
    </div>
  );
}
