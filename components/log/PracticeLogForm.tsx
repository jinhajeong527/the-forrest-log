"use client";

import { useState, useEffect, useActionState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ForrestButton } from "@/components/common/ForrestButton";
import { PanelHeader } from "@/components/common/PanelHeader";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type ActionState } from "@/app/log/actions";
import { type Prop } from "@/lib/generated/prisma/client";
import { type FullLogEntry, type PoseOption } from "@/components/log/LogPageContainer";
import PosePicker from "@/components/log/PosePicker";
import { PropSvg, PROP_LABELS, PROP_ORDER } from "@/components/log/PropSvg";

// ─── Star rating ──────────────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? null : n)}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          className="p-0.5 transition-opacity duration-150 hover:opacity-70"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            className={cn(
              "transition-colors duration-200",
              n <= (value ?? 0)
                ? "fill-primary text-primary"
                : "fill-foreground/12 text-foreground/12"
            )}
            aria-hidden
          >
            <path d="M11 1.5l2.53 5.13 5.66.82-4.1 3.99.97 5.63L11 14.27l-5.06 2.8.97-5.63-4.1-3.99 5.66-.82z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Pose card placeholder ────────────────────────────────────────────────────

function PoseCardSlot({
  pose,
  onClick,
}: {
  pose: { name: string; imageUrl: string | null } | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={pose ? `Change peak pose: ${pose.name}` : "Select peak pose"}
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-sm",
        "border border-foreground/20 transition-all duration-300",
        "hover:border-primary/50 hover:shadow-[0_4px_16px_oklch(0.30_0.05_45/0.15)]",
        !pose && "border-dashed"
      )}
    >
      {/* Corner ornaments */}
      {(
        [
          "top-1.5 left-1.5",
          "top-1.5 right-1.5 rotate-90",
          "bottom-1.5 right-1.5 rotate-180",
          "bottom-1.5 left-1.5 -rotate-90",
        ] as const
      ).map((pos, i) => (
        <svg
          key={i}
          className={`absolute ${pos} text-foreground/25`}
          width="8"
          height="8"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
        >
          <path d="M1 9 L1 1 L9 1" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-between p-2 bg-[oklch(0.95_0.018_78)]">
        {/* Image area */}
        <div className="relative flex-1 w-full">
          {pose?.imageUrl ? (
            <Image
              src={pose.imageUrl}
              alt={pose.name}
              fill
              unoptimized
              sizes="112px"
              className="object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="text-foreground/15 w-10 h-14"
                viewBox="0 0 48 60"
                fill="none"
                aria-hidden
              >
                <path d="M24 54 L24 32" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M24 32 C24 32,13 23,15 12 C17 3,24 1,24 1 C24 1,31 3,33 12 C35 23,24 32,24 32Z"
                  fill="currentColor"
                  opacity="0.4"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Label */}
        <div className="w-full pt-1.5 text-center border-t border-foreground/12">
          <p className="font-cormorant italic text-foreground/60 text-xs tracking-wide leading-tight">
            {pose ? pose.name : "Select pose"}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateInputValue(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Main form ────────────────────────────────────────────────────────────────

interface PracticeLogFormProps {
  mode: "create" | "edit";
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  poses: PoseOption[];
  defaultValues?: Partial<FullLogEntry>;
  /** Pre-fill the date field (YYYY-MM-DD). Used when creating from a selected calendar date. */
  initialDate?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PracticeLogForm({
  mode,
  action,
  poses,
  defaultValues,
  initialDate,
  onSuccess,
  onCancel,
}: PracticeLogFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  const [conditionBefore, setConditionBefore] = useState<number | null>(
    defaultValues?.conditionBefore ?? null
  );
  const [conditionAfter, setConditionAfter] = useState<number | null>(
    defaultValues?.conditionAfter ?? null
  );
  const [selectedProps, setSelectedProps] = useState<Prop[]>(
    defaultValues?.props ?? []
  );
  const [selectedPose, setSelectedPose] = useState<{
    id: string;
    name: string;
    imageUrl: string | null;
  } | null>(
    defaultValues?.peakPose && defaultValues.peakPoseId
      ? {
          id: defaultValues.peakPoseId,
          name: defaultValues.peakPose.name,
          imageUrl: defaultValues.peakPose.imageUrl ?? null,
        }
      : null
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const dateStr =
      mode === "edit" && defaultValues?.date
        ? toDateInputValue(defaultValues.date)
        : (initialDate ?? new Date().toISOString().slice(0, 10));
    return new Date(dateStr + "T00:00:00");
  });

  useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  function toggleProp(prop: Prop) {
    setSelectedProps((prev) =>
      prev.includes(prop) ? prev.filter((p) => p !== prop) : [...prev, prop]
    );
  }

  return (
    <>
      <PosePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        poses={poses}
        onSelect={(pose) => {
          setSelectedPose(pose);
          setPickerOpen(false);
        }}
      />

      <form action={formAction} className="flex flex-col h-full">
        {/* Panel header */}
        <PanelHeader
          left={
            <span className="inline-flex items-center px-3 py-1 border border-transparent text-xs text-muted-foreground">
              {mode === "create" ? "New Log" : "Edit Log"}
            </span>
          }
          right={
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          }
        />

        {/* Form body — scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Hidden inputs */}
          {mode === "edit" && defaultValues?.id && (
            <input type="hidden" name="id" value={defaultValues.id} />
          )}
          {conditionBefore !== null && (
            <input type="hidden" name="conditionBefore" value={conditionBefore} />
          )}
          {conditionAfter !== null && (
            <input type="hidden" name="conditionAfter" value={conditionAfter} />
          )}
          {selectedProps.map((prop) => (
            <input key={prop} type="hidden" name="props" value={prop} />
          ))}
          {selectedPose && (
            <input type="hidden" name="peakPoseId" value={selectedPose.id} />
          )}

          {/* Main layout: left fields + right pose card */}
          <div className="relative pr-48">
            {/* Pose card — floated top-right within padding zone */}
            <div className="absolute top-0 right-0 w-40">
              <PoseCardSlot pose={selectedPose} onClick={() => setPickerOpen(true)} />
            </div>

            <div className="flex flex-col gap-6">
              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="font-cormorant italic text-sm text-muted-foreground">
                  Date
                </label>
                <input type="hidden" name="date" value={toDateInputValue(selectedDate)} />
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="bg-transparent border-b border-foreground/20 pb-2 font-cormorant text-lg text-foreground text-left focus:outline-none focus:border-primary transition-colors"
                    >
                      {selectedDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setDatePickerOpen(false);
                        }
                      }}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                {state.errors?.date && (
                  <p className="text-xs text-destructive">{state.errors.date[0]}</p>
                )}
              </div>

              {/* Theme */}
              <div className="flex flex-col gap-1">
                <label className="font-cormorant italic text-sm text-muted-foreground">
                  Class Theme
                </label>
                <input
                  type="text"
                  name="theme"
                  placeholder="e.g. Deepening Backbends"
                  defaultValue={defaultValues?.theme ?? ""}
                  className="bg-transparent border-b border-foreground/20 pb-2 font-cormorant text-lg text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Peak Pose label — card is in the absolute right column */}
              <div className="flex flex-col gap-1">
                <label className="font-cormorant italic text-sm text-muted-foreground">
                  Peak Pose
                </label>
                <div className="border-b border-foreground/20 pb-2" />
              </div>

              {/* Props */}
              <div className="flex flex-col gap-3">
                <label className="font-cormorant italic text-sm text-muted-foreground">
                  Props
                </label>
                <div className="flex flex-wrap gap-5">
                  {PROP_ORDER.map((prop) => {
                    const isSelected = selectedProps.includes(prop);
                    return (
                      <button
                        key={prop}
                        type="button"
                        onClick={() => toggleProp(prop)}
                        aria-label={PROP_LABELS[prop]}
                        aria-pressed={isSelected}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-1 rounded-sm transition-all duration-200",
                          isSelected ? "text-primary" : "text-foreground/25 hover:text-foreground/40"
                        )}
                      >
                        <PropSvg prop={prop} />
                        <span className="text-[10px] font-sans tracking-wide">
                          {PROP_LABELS[prop]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Condition Before */}
              <div className="flex flex-col gap-2">
                <label className="font-cormorant italic text-sm text-muted-foreground">
                  Condition Before
                </label>
                <StarRating value={conditionBefore} onChange={setConditionBefore} />
              </div>

              {/* Condition After */}
              <div className="flex flex-col gap-2">
                <label className="font-cormorant italic text-sm text-muted-foreground">
                  Condition After
                </label>
                <StarRating value={conditionAfter} onChange={setConditionAfter} />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1">
                <label className="font-cormorant italic text-sm text-muted-foreground">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Reflections on today's practice..."
                  defaultValue={defaultValues?.notes ?? ""}
                  className="bg-transparent border-b border-foreground/20 pb-2 font-cormorant text-base text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sequence placeholder */}
          <div className="mt-8">
            <button
              type="button"
              disabled
              className="px-4 py-1.5 rounded-sm border border-foreground/20 text-xs font-sans text-foreground/40 cursor-not-allowed"
            >
              Sequence
            </button>
          </div>

          {state.message && (
            <p className="mt-4 text-sm text-destructive">{state.message}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-foreground/10">
          <ForrestButton type="submit" disabled={isPending}>
            {isPending
              ? mode === "create"
                ? "Saving..."
                : "Updating..."
              : mode === "create"
                ? "Save Entry"
                : "Update Entry"}
          </ForrestButton>
        </div>
      </form>
    </>
  );
}
