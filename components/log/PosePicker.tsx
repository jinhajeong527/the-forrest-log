"use client";

import { ForrestDialog } from "@/components/common/ForrestDialog";
import PoseCard from "@/components/poses/PoseCard";
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
  return (
    <ForrestDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Choose a Peak Pose"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
        {poses.map((pose) => (
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
    </ForrestDialog>
  );
}
