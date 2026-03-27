"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ForrestDialog } from "@/components/common/ForrestDialog";
import { ForrestButton } from "@/components/common/ForrestButton";
import PoseCard from "@/components/poses/PoseCard";
import SequencePoseCard from "@/components/log/SequencePoseCard";
import PoseCategoryFilter from "@/components/poses/PoseCategoryFilter";
import { type PoseOption } from "@/components/log/LogPageContainer";

export type SequenceItem = {
  id: string;
  poseId: string;
  name: string;
  imageUrl: string | null;
};

interface SequencePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poses: PoseOption[];
  initialSequence: SequenceItem[];
  onSave: (sequence: SequenceItem[]) => void;
}

function SortableSequenceItem({
  item,
  index,
  onRemove,
}: {
  item: SequenceItem;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex-shrink-0 w-16 cursor-grab"
      {...attributes}
      {...listeners}
    >
      <span className="absolute top-1 left-1 z-10 font-cormorant text-[10px] text-foreground/50 leading-none">
        {index + 1}
      </span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label={`Remove ${item.name}`}
        className="absolute top-1 right-1 z-10 w-4 h-4 flex items-center justify-center rounded-full bg-background/80 text-foreground/50 hover:text-destructive text-xs leading-none"
      >
        ×
      </button>
      <SequencePoseCard name={item.name} imageUrl={item.imageUrl} />
    </div>
  );
}

export default function SequencePicker({
  open,
  onOpenChange,
  poses,
  initialSequence,
  onSave,
}: SequencePickerProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sequence, setSequence] = useState<SequenceItem[]>(initialSequence);

  const filtered = activeCategory
    ? poses.filter((p) => p.categories.includes(activeCategory))
    : poses;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function addPose(pose: PoseOption) {
    setSequence((prev) => [
      ...prev,
      { id: crypto.randomUUID(), poseId: pose.id, name: pose.name, imageUrl: pose.imageUrl },
    ]);
  }

  function removePose(id: string) {
    setSequence((prev) => prev.filter((item) => item.id !== id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSequence((prev) => {
        const oldIdx = prev.findIndex((i) => i.id === active.id);
        const newIdx = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      // reset to initialSequence when closing without saving
      setSequence(initialSequence);
    }
    onOpenChange(nextOpen);
  }

  return (
    <ForrestDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Build Sequence"
      className="sm:max-w-2xl flex flex-col overflow-hidden"
    >
      {/* Category filter */}
      <div className="border-b border-foreground/10 pb-3 flex-shrink-0">
        <PoseCategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Pose grid */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 py-2">
          {filtered.map((pose) => (
            <button
              key={pose.id}
              type="button"
              onClick={() => addPose(pose)}
              className="text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
              aria-label={`Add ${pose.name}`}
            >
              <PoseCard name={pose.name} imageUrl={pose.imageUrl} />
            </button>
          ))}
        </div>
      </div>

      {/* Sequence list — shown when poses have been added */}
      {sequence.length > 0 && (
        <div className="flex-shrink-0 border-t border-foreground/10 pt-3">
          <span className="font-cormorant italic text-xs text-muted-foreground uppercase tracking-widest block mb-2">
            Sequence ({sequence.length})
          </span>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sequence.map((i) => i.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
                {sequence.map((item, idx) => (
                  <SortableSequenceItem
                    key={item.id}
                    item={item}
                    index={idx}
                    onRemove={() => removePose(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t border-foreground/10 flex-shrink-0 mt-2">
        <ForrestButton
          type="button"
          onClick={() => {
            onSave(sequence);
            onOpenChange(false);
          }}
        >
          Save Sequence
        </ForrestButton>
      </div>
    </ForrestDialog>
  );
}
