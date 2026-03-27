"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PoseCard from "@/components/poses/PoseCard";

interface SequencePoseCardProps {
  name: string;
  imageUrl: string | null;
}

export default function SequencePoseCard({ name, imageUrl }: SequencePoseCardProps) {
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <PoseCard name={name} imageUrl={imageUrl} showLabel={false} />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="font-cormorant italic text-sm bg-foreground/90 text-background border-none rounded-sm px-3 py-1.5"
        >
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
