import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PoseCategory, PoseLevel } from "@/lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface PoseEntry {
  name: string;
  sanskritName: string | null;
  categories: string[];
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const IMAGES_DIR = path.join(process.cwd(), "public/pose-images");
const POSES_JSON = path.join(process.cwd(), "scripts/forrest-poses.json");

const poseEntries: PoseEntry[] = JSON.parse(fs.readFileSync(POSES_JSON, "utf-8"));

const poses = poseEntries.map((entry, i) => {
  const number = i + 1;
  const slug = toSlug(entry.name);
  const filename = `${number}-${slug}.webp`;
  const imageExists = fs.existsSync(path.join(IMAGES_DIR, filename));

  return {
    name: entry.name,
    sanskritName: entry.sanskritName ?? null,
    categories: entry.categories.filter((c): c is PoseCategory =>
      Object.values(PoseCategory).includes(c as PoseCategory)
    ),
    level: PoseLevel.BEGINNER,
    imageUrl: imageExists ? `/pose-images/${filename}` : null,
  };
});

async function main() {
  console.log("Resetting poses...");
  await prisma.pose.deleteMany();

  console.log("Seeding poses...");
  await prisma.pose.createMany({ data: poses });

  const withImages = poses.filter((p) => p.imageUrl).length;
  console.log(`✅ ${poses.length} poses seeded (${withImages} with images).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
