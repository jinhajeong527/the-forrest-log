-- Remove HIP_OPENERS and RESTORATIVE from PoseCategory enum
-- PostgreSQL does not support DROP VALUE on enums directly,
-- so we recreate the type without those values.

-- 1. Remove any existing rows using HIP_OPENERS or RESTORATIVE (safety guard pre-seed)
UPDATE "poses"
SET "categories" = array_remove(array_remove("categories", 'HIP_OPENERS'::"PoseCategory"), 'RESTORATIVE'::"PoseCategory")
WHERE 'HIP_OPENERS' = ANY("categories") OR 'RESTORATIVE' = ANY("categories");

-- 2. Create new enum type without HIP_OPENERS and RESTORATIVE
CREATE TYPE "PoseCategory_new" AS ENUM (
  'ABDOMINALS',
  'ARM_BALANCES',
  'BACKBENDS',
  'BALANCING_POSES',
  'FORWARD_BENDS',
  'INVERSIONS',
  'LUNGES',
  'SEATED',
  'STANDING_POSES',
  'SUPINE',
  'TWISTS'
);

-- 3. Alter column to use new type
ALTER TABLE "poses"
  ALTER COLUMN "categories" TYPE "PoseCategory_new"[]
  USING "categories"::text::"PoseCategory_new"[];

-- 4. Swap type names
DROP TYPE "PoseCategory";
ALTER TYPE "PoseCategory_new" RENAME TO "PoseCategory";
