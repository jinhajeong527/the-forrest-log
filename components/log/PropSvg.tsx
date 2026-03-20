import { type Prop } from "@/lib/generated/prisma/client";

export const PROP_LABELS: Record<Prop, string> = {
  FOAM_ROLLER: "Foam Roller",
  KNEE_PAD: "Knee Pad",
  BLOCK: "Block",
  STRAP: "Strap",
  BOLSTER: "Bolster",
  BLANKET: "Blanket",
};

export const PROP_ORDER: Prop[] = [
  "FOAM_ROLLER",
  "KNEE_PAD",
  "BLOCK",
  "STRAP",
  "BOLSTER",
  "BLANKET",
];

function PropIcon({ prop }: { prop: Prop }) {
  switch (prop) {
    case "FOAM_ROLLER":
      return (
        <svg width="25" height="30" viewBox="0 0 25 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="7" cy="22" r="6" />
          <circle cx="7" cy="22" r="3.5" />
          <circle cx="7" cy="22" r="1.5" />
          <line x1="2.8" y1="17.8" x2="14" y2="7" />
          <path d="M 14 7 A 6 6 0 0 1 22 15" />
          <line x1="22" y1="15" x2="11.2" y2="26.2" />
        </svg>
      );
    case "KNEE_PAD":
      return (
        <svg width="38" height="26" viewBox="0 0 38 26" fill="currentColor" aria-hidden>
          <rect x="0" y="10" width="38" height="16" rx="2" />
          <rect x="0" y="0" width="38" height="14" rx="2" opacity="0.6" />
          <rect x="0" y="12" width="38" height="2" fill="oklch(0.96 0.01 78)" opacity="0.4" />
        </svg>
      );
    case "BLOCK":
      return (
        <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="26" height="16" rx="1" />
          <path d="M0 8 L5 3 L31 3 L26 8 Z" opacity="0.7" />
          <path d="M26 8 L31 3 L31 19 L26 24 Z" opacity="0.4" />
        </svg>
      );
    case "STRAP":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <ellipse cx="14" cy="14" rx="11" ry="11" />
          <ellipse cx="14" cy="14" rx="5" ry="5" />
        </svg>
      );
    case "BOLSTER":
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor" aria-hidden>
          <path d="M 3 18 L 19 4 L 27 12 L 11 26 Z" opacity="0.8" />
          <circle cx="7" cy="22" r="6" />
          <circle cx="7" cy="22" r="3" fill="oklch(0.96 0.01 78)" opacity="0.3" />
          <circle cx="23" cy="8" r="6" />
          <circle cx="23" cy="8" r="3" fill="oklch(0.96 0.01 78)" opacity="0.3" />
        </svg>
      );
    case "BLANKET":
      return (
        <svg width="36" height="28" viewBox="0 0 36 28" fill="currentColor" aria-hidden>
          {/* Bottom layer */}
          <rect x="0" y="12" width="36" height="16" rx="2" />
          {/* Fold crease on bottom layer */}
          <rect x="0" y="19" width="36" height="1.5" fill="oklch(0.96 0.01 78)" opacity="0.3" />
          {/* Middle layer */}
          <rect x="2" y="6" width="32" height="14" rx="2" opacity="0.72" />
          {/* Fold crease on middle layer */}
          <rect x="2" y="12" width="32" height="1.5" fill="oklch(0.96 0.01 78)" opacity="0.3" />
          {/* Top layer */}
          <rect x="5" y="0" width="26" height="10" rx="2" opacity="0.5" />
        </svg>
      );
  }
}

/** Renders the prop icon inside a fixed-height container for consistent alignment. */
export function PropSvg({ prop }: { prop: Prop }) {
  return (
    <div className="h-8 flex items-center justify-center">
      <PropIcon prop={prop} />
    </div>
  );
}
