import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PoseCategory, PoseLevel } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const poses = [
  {
    name: "Crow Pose",
    sanskritName: "Bakasana",
    categories: [PoseCategory.ARM_BALANCES, PoseCategory.BALANCING_POSES],
    level: PoseLevel.INTERMEDIATE,
  },
  {
    name: "Side Crow",
    sanskritName: "Parsva Bakasana",
    categories: [PoseCategory.ARM_BALANCES, PoseCategory.BALANCING_POSES],
    level: PoseLevel.ADVANCED,
  },
  {
    name: "Headstand",
    sanskritName: "Sirsasana",
    categories: [PoseCategory.INVERSIONS, PoseCategory.BALANCING_POSES],
    level: PoseLevel.ADVANCED,
  },
  {
    name: "Forearm Stand",
    sanskritName: "Pincha Mayurasana",
    categories: [PoseCategory.INVERSIONS, PoseCategory.ARM_BALANCES],
    level: PoseLevel.ADVANCED,
  },
  {
    name: "Turbo Dog",
    categories: [PoseCategory.INVERSIONS],
    level: PoseLevel.INTERMEDIATE,
  },
  {
    name: "Dolphin Pose",
    categories: [PoseCategory.INVERSIONS],
    level: PoseLevel.BEGINNER,
  },
  {
    name: "Wheel Pose",
    sanskritName: "Urdhva Dhanurasana",
    categories: [PoseCategory.BACKBENDS],
    level: PoseLevel.INTERMEDIATE,
  },
  {
    name: "Camel Pose",
    sanskritName: "Ustrasana",
    categories: [PoseCategory.BACKBENDS],
    level: PoseLevel.INTERMEDIATE,
  },
  {
    name: "Dancer Pose",
    sanskritName: "Natarajasana",
    categories: [PoseCategory.BALANCING_POSES, PoseCategory.STANDING_POSES],
    level: PoseLevel.INTERMEDIATE,
  },
  {
    name: "Standing Split",
    sanskritName: "Urdhva Prasarita Eka Padasana",
    categories: [PoseCategory.BALANCING_POSES, PoseCategory.STANDING_POSES],
    level: PoseLevel.INTERMEDIATE,
  },
];

async function main() {
  const existing = await prisma.pose.count();
  if (existing > 0) {
    console.log(`Already have ${existing} poses — skipping seed.`);
    return;
  }

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
