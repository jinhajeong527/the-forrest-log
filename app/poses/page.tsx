import { Suspense } from "react";
import PoseLibrarySkeleton from "@/components/poses/PoseLibrarySkeleton";
import { getPoses } from "@/lib/pose-queries";
import PoseGrid from "@/components/poses/PoseGrid";
import PageHeader from "@/components/common/PageHeader";
import { CATEGORIES } from "@/components/poses/categories";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default function PosesPage({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen bg-background">
      <PageHeader title="Pose Library" />
      <Suspense fallback={<PoseLibrarySkeleton />}>
        <PoseLibraryContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function PoseLibraryContent({ searchParams }: PageProps) {
  const { category } = await searchParams;

  const activeCategory = CATEGORIES.find((c) => c.value === category)
    ?.value ?? null;

  const allPoses = await getPoses();
  const poses = activeCategory
    ? allPoses.filter((pose) => pose.categories.includes(activeCategory))
    : allPoses;

  return <PoseGrid poses={poses} activeCategory={activeCategory} />;
}
