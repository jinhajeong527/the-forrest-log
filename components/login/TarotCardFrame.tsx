import { cn } from "@/lib/utils";

interface TarotCardFrameProps {
  className?: string;
}

export default function TarotCardFrame({ className }: TarotCardFrameProps) {
  return (
    <div
      className={cn(
        "relative w-28 h-40 rounded-sm overflow-hidden",
        "border-2 border-foreground/50",
        "shadow-[2px_4px_12px_oklch(0.30_0.05_45/0.4)]",
        "tarot-card-bg",
        className
      )}

    >
      {/* Corner ornaments */}
      {["top-1 left-1", "top-1 right-1 rotate-90", "bottom-1 right-1 rotate-180", "bottom-1 left-1 -rotate-90"].map(
        (pos, i) => (
          <svg
            key={i}
            className={`absolute ${pos} text-muted-foreground opacity-70`}
            width="10" height="10" viewBox="0 0 10 10" fill="none"
          >
            <path d="M1 9 L1 1 L9 1" stroke="currentColor" strokeWidth="1" fill="none"/>
          </svg>
        )
      )}

      {/* Illustration placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2">
        <svg
          className="text-[oklch(0.42_0.07_110)] opacity-60"
          width="48" height="56" viewBox="0 0 48 56" fill="none"
        >
          {/* Tree silhouette */}
          <path d="M24 52 L24 30" stroke="currentColor" strokeWidth="2"/>
          <path d="M24 30 C24 30, 14 22, 16 12 C18 4, 24 2, 24 2 C24 2, 30 4, 32 12 C34 22, 24 30, 24 30Z" fill="currentColor" opacity="0.5"/>
          <path d="M24 38 C24 38, 16 32, 18 24 C20 18, 24 16, 24 16 C24 16, 28 18, 30 24 C32 32, 24 38, 24 38Z" fill="currentColor" opacity="0.6"/>
          {/* Moon */}
          <path d="M36 8 C34 6, 34 2, 38 2 C35 4, 35 8, 38 10 C34 10, 34 8, 36 8Z" fill="currentColor" opacity="0.7"/>
        </svg>

        {/* Yoga figure placeholder */}
        <svg
          className="text-foreground opacity-70"
          width="36" height="24" viewBox="0 0 36 24" fill="none"
        >
          {/* Warrior pose suggestion */}
          <circle cx="18" cy="3" r="2.5" fill="currentColor"/>
          <line x1="18" y1="5.5" x2="18" y2="14" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="18" y1="9" x2="8" y2="7" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="18" y1="9" x2="28" y2="12" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="18" y1="14" x2="10" y2="22" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="18" y1="14" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-0 inset-x-0 py-1 text-center bg-foreground/15">
        <span className="font-cormorant italic text-foreground text-[10px] tracking-widest uppercase">
          Warrior
        </span>
      </div>
    </div>
  );
}
