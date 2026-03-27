import { cn } from "@/lib/utils";

export const STAR_PATH =
  "M11 1.5l2.53 5.13 5.66.82-4.1 3.99.97 5.63L11 14.27l-5.06 2.8.97-5.63-4.1-3.99 5.66-.82z";

interface ConditionStarsProps {
  value: number;
}

export function ConditionStars({ value }: ConditionStarsProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          className={cn(
            "transition-colors duration-200",
            n <= value ? "fill-primary text-primary" : "fill-foreground/12 text-foreground/12"
          )}
          aria-hidden
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
}
