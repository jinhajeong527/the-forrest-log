"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PoseCard from "@/components/poses/PoseCard";
import CategoryFilter from "@/components/poses/CategoryFilter";
import { CATEGORIES, pillClass } from "@/components/poses/categories";
import ForrestSearchInput from "@/components/common/ForrestSearchInput";

type Pose = { id: string; name: string; imageUrl: string | null };

interface Props {
  poses: Pose[];
  activeCategory: string | null;
}

export default function PoseGrid({ poses, activeCategory }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      query.trim()
        ? poses.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase())
          )
        : poses,
    [poses, query]
  );

  return (
    <>
      {/* Category filter bar */}
      <div className="border-b border-foreground/10">
        <div className="max-w-5xl mx-auto px-4 pt-5 pb-3">
          <CategoryFilter>
            <Link href="/poses" className={pillClass(!activeCategory)}>
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/poses?category=${cat.value}`}
                className={pillClass(activeCategory === cat.value)}
              >
                {cat.label}
              </Link>
            ))}
          </CategoryFilter>
        </div>
        <div className="border-t border-foreground/10" />
        <div className="max-w-5xl mx-auto px-4 py-2 flex justify-end">
          <ForrestSearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search poses..."
            className="w-44"
          />
        </div>
      </div>

      {/* Pose grid */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="font-cormorant italic text-muted-foreground text-xl">
              {query.trim()
                ? `No poses matching "${query}"`
                : "No poses found"}
            </p>
            {query.trim() ? (
              <button
                onClick={() => setQuery("")}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/poses"
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Clear filter
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((pose) => (
              <PoseCard
                key={pose.id}
                name={pose.name}
                imageUrl={pose.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
