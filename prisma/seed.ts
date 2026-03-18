import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PoseCategory, PoseLevel } from "@/lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const poses = [
  {
    name: "Downward Facing Dog",
    sanskritName: "Adho Mukha Svanasana",
    categories: [PoseCategory.INVERSIONS],
    level: PoseLevel.BEGINNER,
    imageUrl: "/pose-images/1-downward-pacing-dog.webp",
  },
  {
    name: "Corpse Pose",
    sanskritName: "Shavasana",
    categories: [PoseCategory.RESTORATIVE],
    level: PoseLevel.BEGINNER,
    imageUrl: "/pose-images/2-corpse-pose.webp",
  },
  {
    name: "Mountain Pose",
    sanskritName: "Tadasana",
    categories: [PoseCategory.STANDING_POSES],
    level: PoseLevel.BEGINNER,
    imageUrl: "/pose-images/3-mountain-pose.webp",
  },
  {
    name: "Standing Forward Fold",
    sanskritName: "Uttanasana",
    categories: [PoseCategory.STANDING_POSES, PoseCategory.INVERSIONS],
    level: PoseLevel.BEGINNER,
    imageUrl: "/pose-images/4-standing-forward-fold-pose.webp",
  },
];

async function main() {
  console.log("Resetting poses...");
  await prisma.pose.deleteMany();

  console.log("Seeding poses...");
  await prisma.pose.createMany({ data: poses });
  console.log(`✅ ${poses.length} poses seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
