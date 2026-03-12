import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PoseCategory } from "@/lib/generated/prisma/client";
import PoseCard from "@/components/poses/PoseCard";
import CategoryFilter from "@/components/poses/CategoryFilter";
import LogoMark from "@/components/LogoMark";

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 10 10" fill="currentColor" className="text-[oklch(0.72_0.12_80)]" aria-hidden="true">
    <path d="M5 0 L6.5 3.5 L10 5 L6.5 6.5 L5 10 L3.5 6.5 L0 5 L3.5 3.5 Z"/>
  </svg>
);

const CATEGORIES = [
  { value: PoseCategory.ABDOMINALS, label: "Abdominals" },
  { value: PoseCategory.ARM_BALANCES, label: "Arm Balances" },
  { value: PoseCategory.BACKBENDS, label: "Backbends" },
  { value: PoseCategory.BALANCING_POSES, label: "Balancing Poses" },
  { value: PoseCategory.HIP_OPENERS, label: "Hip Openers" },
  { value: PoseCategory.INVERSIONS, label: "Inversions" },
  { value: PoseCategory.LUNGES, label: "Lunges" },
  { value: PoseCategory.RESTORATIVE, label: "Restorative" },
  { value: PoseCategory.STANDING_POSES, label: "Standing Poses" },
];

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
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-background/80 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-[1fr_auto_1fr] items-center">
          <Link href="/" className="justify-self-start">
            <LogoMark />
          </Link>
          <div className="flex items-center gap-2">
            <StarIcon />
            <h1 className="font-cormorant text-5xl font-semibold tracking-wide text-secondary-foreground">
              Pose Library
            </h1>
            <StarIcon />
          </div>
          <div />
        </div>
      </div>

      {/* Category filter bar */}
      <div className="border-b border-foreground/10">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <CategoryFilter categories={CATEGORIES} activeCategory={activeCategory} />
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
