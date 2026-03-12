export default function LogoMark() {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Moon */}
      <span className="text-muted-foreground text-xl leading-none">☽</span>

      {/* Botanical wreath + title */}
      <div className="relative flex flex-col items-center">
        {/* Decorative top rule */}
        <div className="flex items-center gap-2 mb-1">
          <svg width="36" height="8" viewBox="0 0 36 8" fill="none" className="text-muted-foreground">
            <path d="M0 4 C6 1, 12 7, 18 4 C24 1, 30 7, 36 4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7"/>
          </svg>
          <span className="text-muted-foreground text-xs tracking-[0.2em] font-[family-name:var(--font-geist-sans)] uppercase">
            The
          </span>
          <svg width="36" height="8" viewBox="0 0 36 8" fill="none" className="text-muted-foreground scale-x-[-1]">
            <path d="M0 4 C6 1, 12 7, 18 4 C24 1, 30 7, 36 4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7"/>
          </svg>
        </div>

        {/* Main title */}
        <p className="font-cormorant font-semibold text-foreground tracking-wide">
          <span className="block text-4xl leading-none">Forrest</span>
          <span className="block text-4xl leading-tight">Log</span>
        </p>

        {/* Botanical leaves — left */}
        <svg
          className="absolute -left-10 top-4 text-[oklch(0.48_0.07_120)] opacity-70"
          width="32" height="40" viewBox="0 0 32 40" fill="none"
          aria-hidden="true"
        >
          <path d="M16 38 C16 38, 2 28, 4 16 C6 8, 14 4, 16 2 C14 12, 8 18, 16 38Z" fill="currentColor" opacity="0.5"/>
          <path d="M16 38 C16 38, 6 24, 10 14 C13 7, 18 5, 16 2 C18 12, 14 22, 16 38Z" fill="currentColor" opacity="0.35"/>
        </svg>

        {/* Botanical leaves — right */}
        <svg
          className="absolute -right-10 top-4 text-[oklch(0.48_0.07_120)] opacity-70 scale-x-[-1]"
          width="32" height="40" viewBox="0 0 32 40" fill="none"
          aria-hidden="true"
        >
          <path d="M16 38 C16 38, 2 28, 4 16 C6 8, 14 4, 16 2 C14 12, 8 18, 16 38Z" fill="currentColor" opacity="0.5"/>
          <path d="M16 38 C16 38, 6 24, 10 14 C13 7, 18 5, 16 2 C18 12, 14 22, 16 38Z" fill="currentColor" opacity="0.35"/>
        </svg>
      </div>
    </div>
  );
}
