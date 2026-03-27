import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PoseCard from "@/components/poses/PoseCard";
import CategoryFilter from "@/components/poses/CategoryFilter";
import { CATEGORIES, pillClass } from "@/components/poses/categories";
import PageHeader from "@/components/common/PageHeader";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PosesPage({ searchParams }: PageProps) {
  const { category } = await searchParams;

  const activeCategory = CATEGORIES.find((c) => c.value === category)
    ?.value ?? null;

  const poses = await prisma.pose.findMany({
    where: activeCategory
      ? { categories: { has: activeCategory } }
      : undefined,
    select: { id: true, name: true, imageUrl: true },
    orderBy: { imageUrl: "asc" },
  });

  return (
    <main className="min-h-screen bg-background">
      <PageHeader title="Pose Library" />

      {/* Category filter bar */}
      <div className="border-b border-foreground/10">
        <div className="max-w-5xl mx-auto px-4 py-5">
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
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Pose grid */}
        {poses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="font-cormorant italic text-muted-foreground text-xl">
              No poses found
            </p>
            <Link
              href="/poses"
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Clear filter
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {poses.map((pose) => (
              <PoseCard
                key={pose.id}
                name={pose.name}
                imageUrl={pose.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
