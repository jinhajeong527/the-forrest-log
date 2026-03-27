"use client";

import CategoryFilter from "@/components/poses/CategoryFilter";
import { CATEGORIES, pillClass } from "@/components/poses/categories";

interface PoseCategoryFilterProps {
  activeCategory: string | null;
  onChange: (cat: string | null) => void;
}

export default function PoseCategoryFilter({
  activeCategory,
  onChange,
}: PoseCategoryFilterProps) {
  return (
    <CategoryFilter>
      <button
        type="button"
        onClick={() => onChange(null)}
        className={pillClass(!activeCategory)}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          type="button"
          onClick={() => onChange(cat.value)}
          className={pillClass(activeCategory === cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </CategoryFilter>
  );
}
