"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  value: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | null;
}

const pillClass = (active: boolean) =>
  cn(
    "flex-shrink-0 px-4 py-2 rounded-sm font-cormorant font-semibold text-base transition-all duration-300 border",
    active
      ? "bg-primary text-primary-foreground border-primary"
      : "bg-secondary text-secondary-foreground border-border hover:border-foreground/40 hover:text-foreground"
  );

export default function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center" role="navigation" aria-label="Filter by category">
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 z-10 flex items-center justify-center w-10 h-full bg-gradient-to-r from-background via-background/80 to-transparent text-foreground/40 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-none"
      >
        <Link href="/poses" className={pillClass(!activeCategory)}>
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.value}
            href={`/poses?category=${cat.value}`}
            className={pillClass(activeCategory === cat.value)}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {showRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 z-10 flex items-center justify-center w-10 h-full bg-gradient-to-l from-background via-background/80 to-transparent text-foreground/40 hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
