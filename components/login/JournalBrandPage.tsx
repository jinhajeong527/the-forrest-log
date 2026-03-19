import LogoMark from "@/components/common/LogoMark";
import TarotCardFrame from "./TarotCardFrame";

export default function JournalBrandPage() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-6 px-8 py-12 h-full">
      {/* Botanical side decoration */}
      <svg
        className="absolute left-2 bottom-8 text-[oklch(0.48_0.07_120)] opacity-40 pointer-events-none"
        width="40" height="80" viewBox="0 0 40 80" fill="none"
      >
        <path d="M20 78 C20 78, 4 60, 6 40 C8 24, 18 14, 20 8 C22 14, 24 28, 14 46 C8 58, 20 78, 20 78Z" fill="currentColor"/>
        <path d="M20 78 C20 78, 10 56, 16 40 C20 28, 26 22, 20 8 C24 22, 22 40, 26 56 C28 66, 20 78, 20 78Z" fill="currentColor" opacity="0.6"/>
      </svg>

      <div className="flex flex-col items-center gap-1">
        <LogoMark />
        <p className="mt-3 font-cormorant italic text-muted-foreground text-sm tracking-wide">
          Return to your mat.
        </p>
      </div>

      {/* Tarot card + copy */}
      <div className="flex items-start gap-5">
        <TarotCardFrame />

        <div className="flex flex-col gap-2 pt-2">
          <p className="font-cormorant italic text-foreground text-base leading-relaxed">
            Every<br />
            practice<br />
            leaves a trace.
          </p>
          <div className="w-6 h-px bg-border/50 my-1" />
          <p className="font-cormorant italic text-muted-foreground text-sm leading-relaxed">
            Breathe.<br />
            Strengthen.<br />
            Return.
          </p>
        </div>
      </div>
    </div>
  );
}
