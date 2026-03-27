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
        <svg width="32" height="32" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {/* Body + right rounded cap */}
          <path d="M18 74 L74 18 A20 20 0 0 1 102 46 L46 102" />
          {/* Left circular end (cross-section) */}
          <circle cx="32" cy="88" r="20" />
          <circle cx="32" cy="88" r="12" />
        </svg>
      );
    case "KNEE_PAD":
      return (
        <svg width="46" height="22" viewBox="0 0 52 26" fill="currentColor" aria-hidden>
          {/* Main face (front) */}
          <rect x="0" y="14" width="42" height="5" rx="1" />
          {/* Top face */}
          <path d="M0 14 L6 8 L48 8 L42 14 Z" opacity="0.7" />
          {/* Right face */}
          <path d="M42 14 L48 8 L48 13 L42 19 Z" opacity="0.4" />
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
        <svg width="53" height="32" viewBox="0 0 200 120" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <ellipse cx="60" cy="35" rx="35" ry="20" />
          <ellipse cx="60" cy="35" rx="18" ry="10" />
          <path d="M25 45 C 40 60, 80 60, 120 60" />
          <path d="M25 45 L25 85 C 60 95, 95 85, 120 70" />
          <rect x="120" y="45" width="40" height="35" rx="8" />
          <rect x="130" y="50" width="20" height="25" rx="4" />
        </svg>
      );
    case "BOLSTER":
      return (
        <svg width="58" height="33" viewBox="0 0 220 120" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="40" y="30" width="140" height="60" rx="30" />
          <rect x="70" y="40" width="80" height="40" rx="6" />
          <path d="M40 60 C 20 40, 20 80, 40 60" />
          <path d="M180 60 C 200 40, 200 80, 180 60" />
        </svg>
      );
    case "BLANKET":
      return (
        <svg width="44" height="44" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M25 70 L25 45 Q25 30 40 30 L80 30 Q95 30 95 45 L95 70 Q95 85 80 85 L40 85 Q25 85 25 70 Z" />
          <path d="M35 75 L35 50 Q35 40 45 40 L75 40 Q85 40 85 50 L85 75 Q85 85 75 85 L45 85 Q35 85 35 75 Z" />
          <path d="M65 55 Q75 55 75 65" />
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
