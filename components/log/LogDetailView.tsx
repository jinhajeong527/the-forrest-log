"use client";

import { cn } from "@/lib/utils";
import { ForrestButton } from "@/components/common/ForrestButton";
import { PanelHeader } from "@/components/common/PanelHeader";
import PoseCard from "@/components/poses/PoseCard";
import { PropSvg, PROP_LABELS, PROP_ORDER } from "@/components/log/PropSvg";
import { type FullLogEntry } from "@/components/log/LogPageContainer";

interface LogDetailViewProps {
  log: FullLogEntry;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  isDeleting: boolean;
  deleteError?: string | null;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ConditionPips({ value }: { value: number }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            n <= value ? "bg-primary" : "bg-foreground/15"
          )}
        />
      ))}
    </div>
  );
}

export default function LogDetailView({
  log,
  onEdit,
  onDelete,
  onBack,
  isDeleting,
  deleteError,
}: LogDetailViewProps) {
  const logProps = PROP_ORDER.filter((p) => log.props.includes(p));

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <PanelHeader
        left={
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        }
        right={
          <div className="flex gap-3">
            <ForrestButton variant="outline" size="sm" onClick={onEdit}>
              Edit
            </ForrestButton>
            <ForrestButton
              variant="destructive"
              size="sm"
              onClick={() => onDelete(log.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </ForrestButton>
          </div>
        }
      />
      {deleteError && (
        <p className="px-8 py-2 text-xs text-destructive border-b border-foreground/10">
          {deleteError}
        </p>
      )}
      {/* Detail body — scrollable */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Main layout: left content + right pose card */}
        <div className="relative pr-48">
          {/* Pose card — top right */}
          {log.peakPose && (
            <div className="absolute top-0 right-0 w-40">
              <PoseCard
                name={log.peakPose.name}
                imageUrl={log.peakPose.imageUrl}
              />
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Date + Theme */}
            <div className="pb-4 border-b border-foreground/10">
              <time className="block font-cormorant text-3xl font-semibold tracking-wide text-foreground">
                {formatDate(log.date)}
              </time>
              {log.theme && (
                <p className="mt-1 font-cormorant italic text-lg text-muted-foreground">
                  {log.theme}
                </p>
              )}
            </div>

            {/* Peak Pose label */}
            {log.peakPose && (
              <div className="flex flex-col gap-1">
                <span className="font-cormorant italic text-xs text-muted-foreground uppercase tracking-widest">
                  Peak Pose
                </span>
                <span className="font-cormorant text-lg text-foreground">
                  {log.peakPose.name}
                </span>
              </div>
            )}

            {/* Condition Before / After */}
            {(log.conditionBefore !== null || log.conditionAfter !== null) && (
              <div className="flex gap-10">
                {log.conditionBefore !== null && (
                  <div className="flex flex-col gap-2">
                    <span className="font-cormorant italic text-xs text-muted-foreground uppercase tracking-widest">
                      Before
                    </span>
                    <ConditionPips value={log.conditionBefore} />
                  </div>
                )}
                {log.conditionAfter !== null && (
                  <div className="flex flex-col gap-2">
                    <span className="font-cormorant italic text-xs text-muted-foreground uppercase tracking-widest">
                      After
                    </span>
                    <ConditionPips value={log.conditionAfter} />
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {log.notes && (
              <div className="flex flex-col gap-2">
                <span className="font-cormorant italic text-xs text-muted-foreground uppercase tracking-widest">
                  Notes
                </span>
                <p className="font-cormorant text-base text-foreground leading-relaxed whitespace-pre-wrap">
                  {log.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Props */}
        {logProps.length > 0 && (
          <div className="flex flex-col gap-2 mt-8">
            <span className="font-cormorant italic text-xs text-muted-foreground uppercase tracking-widest">
              Props
            </span>
            <div className="flex flex-wrap gap-5">
              {logProps.map((prop) => (
                <div
                  key={prop}
                  className="flex flex-col items-center gap-1.5 p-1 text-primary"
                >
                  <PropSvg prop={prop} />
                  <span className="text-[10px] font-sans tracking-wide">
                    {PROP_LABELS[prop]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
