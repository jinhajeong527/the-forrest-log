"use client";

import { useState } from "react";
import { ForrestDialog } from "@/components/common/ForrestDialog";
import PoseCard from "@/components/poses/PoseCard";
import CategoryFilter from "@/components/poses/CategoryFilter";
import { CATEGORIES, pillClass } from "@/components/poses/categories";
import { type PoseOption } from "@/components/log/LogPageContainer";

interface PosePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poses: PoseOption[];
  onSelect: (pose: PoseOption) => void;
}

export default function PosePicker({
  open,
  onOpenChange,
  poses,
  onSelect,
}: PosePickerProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? poses.filter((p) => p.categories.includes(activeCategory))
    : poses;

  return (
    <ForrestDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Choose a Peak Pose"
      className="flex flex-col overflow-hidden"
    >
      <div className="border-b border-foreground/10 pb-3 flex-shrink-0">
        <CategoryFilter>
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={pillClass(!activeCategory)}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={pillClass(activeCategory === cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </CategoryFilter>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 py-2">
          {filtered.map((pose) => (
            <button
              key={pose.id}
              type="button"
              onClick={() => onSelect(pose)}
              className="text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
              aria-label={`Select ${pose.name}`}
            >
              <PoseCard name={pose.name} imageUrl={pose.imageUrl} />
            </button>
          ))}
        </div>
      </div>
    </ForrestDialog>
  );
}
