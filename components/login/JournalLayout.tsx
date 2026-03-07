import { cn } from "@/lib/utils";

interface JournalLayoutProps {
  leftPage: React.ReactNode;
  rightPage: React.ReactNode;
  className?: string;
}

export default function JournalLayout({
  leftPage,
  rightPage,
  className,
}: JournalLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center p-4 md:p-8",
        "bg-[oklch(0.93_0.02_75)] noise-texture",
        className
      )}
    >
      {/* Book container */}
      <div
        className={cn(
          "relative w-full max-w-4xl",
          "flex flex-col md:flex-row",
          "rounded-sm overflow-hidden",
          "journal-shadow"
        )}
      >
        {/* Leather spine — desktop only */}
        <div className="hidden md:block w-6 flex-shrink-0 spine-gradient z-10" />

        {/* Left page */}
        <div className="flex-1 min-h-[480px] relative overflow-hidden page-left noise-texture">
          <div className="absolute inset-0 pointer-events-none page-lines" />
          {leftPage}
        </div>

        {/* Right page */}
        <div className="flex-1 min-h-[480px] relative overflow-hidden border-t md:border-t-0 md:border-l border-border/50 page-right noise-texture">
          <div className="absolute inset-0 pointer-events-none page-lines" />
          {rightPage}
        </div>

        {/* Bookmark ribbon — desktop only */}
        <div className="absolute top-0 right-8 w-5 h-16 z-20 hidden md:block bookmark-shape" />
      </div>
    </div>
  );
}
