import Image from "next/image";
import { cn } from "@/lib/utils";

interface PoseCardProps {
  name: string;
  imageUrl?: string | null;
  className?: string;
}

export default function PoseCard({ name, imageUrl, className }: PoseCardProps) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-sm",
        "transition-all duration-500 ease-in-out",
        "hover:-translate-y-1 hover:shadow-[0_12px_32px_oklch(0.30_0.05_45/0.35)]",
        className
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain"
        />
      ) : (
        /* Placeholder — tarot card frame without an image */
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-between",
            "border border-foreground/25 rounded-sm",
            "bg-[oklch(0.95_0.018_78)]",
            "shadow-[2px_4px_14px_oklch(0.30_0.05_45/0.2)]",
            "px-2 py-3"
          )}
          aria-label={name}
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
              className={`absolute ${pos} text-foreground/35`}
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 9 L1 1 L9 1"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          ))}

          {/* Illustration placeholder */}
          <div className="flex-1 flex items-center justify-center">
            <svg
              className="text-foreground/20 w-16 h-20"
              viewBox="0 0 48 60"
              fill="none"
              aria-hidden="true"
            >
              <path d="M24 54 L24 32" stroke="currentColor" strokeWidth="2" />
              <path
                d="M24 32 C24 32,13 23,15 12 C17 3,24 1,24 1 C24 1,31 3,33 12 C35 23,24 32,24 32Z"
                fill="currentColor"
                opacity="0.4"
              />
              <path
                d="M24 40 C24 40,15 33,17 25 C19 18,24 16,24 16 C24 16,29 18,31 25 C33 33,24 40,24 40Z"
                fill="currentColor"
                opacity="0.5"
              />
              <path
                d="M37 9 C35 7,35 3,39 3 C36 5,36 9,39 11 C35 11,35 9,37 9Z"
                fill="currentColor"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Bottom label */}
          <div className="w-full pt-2 text-center border-t border-foreground/12">
            <p className="font-cormorant italic text-foreground text-sm tracking-wide leading-tight">
              {name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
