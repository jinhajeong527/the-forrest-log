import { cn } from "@/lib/utils";
import { PoseCategory } from "@/lib/generated/prisma/enums";

export const pillClass = (active: boolean) =>
  cn(
    "flex-shrink-0 px-4 py-2 rounded-sm font-cormorant font-semibold text-base transition-all duration-300 border",
    active
      ? "bg-primary text-primary-foreground border-primary"
      : "bg-secondary text-secondary-foreground hover:border-foreground/40 hover:text-foreground"
  );

const CATEGORY_LABELS = {
  [PoseCategory.ABDOMINALS]: "Abdominals",
  [PoseCategory.ARM_BALANCES]: "Arm Balances",
  [PoseCategory.BACKBENDS]: "Backbends",
  [PoseCategory.BALANCING_POSES]: "Balancing Poses",
  [PoseCategory.FORWARD_BENDS]: "Forward Bends",
  [PoseCategory.INVERSIONS]: "Inversions",
  [PoseCategory.LUNGES]: "Lunges",
  [PoseCategory.SEATED]: "Seated",
  [PoseCategory.STANDING_POSES]: "Standing Poses",
  [PoseCategory.SUPINE]: "Supine",
  [PoseCategory.TWISTS]: "Twists",
} satisfies Record<PoseCategory, string>;

export const CATEGORIES = (Object.entries(CATEGORY_LABELS) as [PoseCategory, string][]).map(
  ([value, label]) => ({ value, label })
) satisfies { value: PoseCategory; label: string }[];
