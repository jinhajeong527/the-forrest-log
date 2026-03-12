-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Prop" AS ENUM ('FOAM_ROLLER', 'KNEE_PAD', 'BLOCK', 'STRAP', 'BOLSTER', 'BLANKET');

-- CreateEnum
CREATE TYPE "PoseCategory" AS ENUM ('ABDOMINALS', 'ARM_BALANCES', 'BACKBENDS', 'BALANCING_POSES', 'HIP_OPENERS', 'INVERSIONS', 'LUNGES', 'RESTORATIVE', 'STANDING_POSES');

-- CreateEnum
CREATE TYPE "PoseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "poses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "sanskrit_name" TEXT,
    "categories" "PoseCategory"[],
    "level" "PoseLevel" NOT NULL DEFAULT 'BEGINNER',
    "description" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "poses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "theme" TEXT,
    "peak_pose_id" UUID,
    "condition_before" INTEGER,
    "condition_after" INTEGER,
    "props" "Prop"[] DEFAULT ARRAY[]::"Prop"[],
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sequence_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "practice_log_id" UUID NOT NULL,
    "pose_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sequence_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sequence_logs_practice_log_id_order_idx" ON "sequence_logs"("practice_log_id", "order");

-- AddForeignKey
ALTER TABLE "practice_logs" ADD CONSTRAINT "practice_logs_peak_pose_id_fkey" FOREIGN KEY ("peak_pose_id") REFERENCES "poses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sequence_logs" ADD CONSTRAINT "sequence_logs_practice_log_id_fkey" FOREIGN KEY ("practice_log_id") REFERENCES "practice_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sequence_logs" ADD CONSTRAINT "sequence_logs_pose_id_fkey" FOREIGN KEY ("pose_id") REFERENCES "poses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddCheckConstraint (condition_before/after range validation — defense in depth with Zod)
ALTER TABLE "practice_logs"
  ADD CONSTRAINT "condition_before_range"
  CHECK (condition_before BETWEEN 1 AND 5);

ALTER TABLE "practice_logs"
  ADD CONSTRAINT "condition_after_range"
  CHECK (condition_after BETWEEN 1 AND 5);
