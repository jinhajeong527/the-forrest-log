/**
 * Sync Pose Image URLs
 *
 * Updates imageUrl for each pose in the DB based on whether the corresponding
 * file exists in public/pose-images/. Does not delete or recreate any poses.
 *
 * Usage:
 *   pnpm pose:sync-images
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const IMAGES_DIR = path.join(process.cwd(), "public/pose-images");
const POSES_JSON = path.join(process.cwd(), "scripts/forrest-poses.json");

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface PoseEntry {
  name: string;
}

async function main() {
  const poseEntries: PoseEntry[] = JSON.parse(
    fs.readFileSync(POSES_JSON, "utf-8")
  );

  let withImage = 0;
  let withoutImage = 0;
  let notFound = 0;

  for (let i = 0; i < poseEntries.length; i++) {
    const entry = poseEntries[i];
    const number = i + 1;
    const slug = toSlug(entry.name);
    const filename = `${number}-${slug}.webp`;
    const imageExists = fs.existsSync(path.join(IMAGES_DIR, filename));
    const imageUrl = imageExists ? `/pose-images/${filename}` : null;

    const result = await prisma.pose.updateMany({
      where: { name: entry.name },
      data: { imageUrl },
    });

    if (result.count === 0) {
      notFound++;
    } else if (imageExists) {
      withImage++;
    } else {
      withoutImage++;
    }
  }

  console.log(`✅ Done.`);
  console.log(`   With image:    ${withImage}`);
  console.log(`   Without image: ${withoutImage}`);
  if (notFound > 0) {
    console.log(`   Not in DB:     ${notFound} (run pnpm db:seed first)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
