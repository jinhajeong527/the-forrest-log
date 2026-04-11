import { prisma } from "@/lib/prisma";
import PoseGrid from "@/components/poses/PoseGrid";
import PageHeader from "@/components/common/PageHeader";
import { CATEGORIES } from "@/components/poses/categories";

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
      <PoseGrid poses={poses} activeCategory={activeCategory} />
    </main>
  );
}
