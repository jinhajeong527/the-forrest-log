/**
 * Pose Image Import Script
 *
 * Converts PNG/JPG images to WebP (trims transparent edges, resizes to 400px wide)
 * and saves to public/pose-images/ for static serving.
 *
 * DB registration is handled separately via prisma/seed.ts.
 *
 * Usage:
 *   pnpm tsx scripts/import-pose-images.ts --input /path/to/folder [--output /path] [--force]
 *
 * File naming:
 *   1. downward-pacing-dog.png  →  1-downward-pacing-dog.webp
 *   2. corpse-pose.png          →  2-corpse-pose.webp
 *
 * Flags:
 *   --output  Output directory (default: public/pose-images)
 *   --force   Overwrite existing WebP files
 */

import sharp from "sharp";
import { readdir, mkdir, writeFile, access } from "fs/promises";
import { join, basename, extname } from "path";

// --- CLI args ---
const args = process.argv.slice(2);
const inputIdx = args.indexOf("--input");
const outputIdx = args.indexOf("--output");
const force = args.includes("--force");

if (inputIdx === -1 || !args[inputIdx + 1]) {
  console.error(
    "Usage: pnpm pose:import --input /path/to/folder [--output /path/to/save] [--force]"
  );
  process.exit(1);
}

const inputDir = args[inputIdx + 1];
const outputDir = outputIdx !== -1 ? args[outputIdx + 1] : "public/pose-images";

// "1. downward-pacing-dog.png" → "1-downward-pacing-dog"
function fileToSlug(filename: string): string {
  return basename(filename, extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const allFiles = await readdir(inputDir);
  const imageFiles = allFiles.filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));

  if (imageFiles.length === 0) {
    console.log("No image files found in", inputDir);
    return;
  }

  await mkdir(outputDir, { recursive: true });
  console.log(`Found ${imageFiles.length} image(s) → saving to ${outputDir}\n`);

  for (const file of imageFiles) {
    const slug = fileToSlug(file);
    const outputPath = join(outputDir, `${slug}.webp`);

    console.log(`▶ ${file}  →  ${slug}.webp`);

    if (!force) {
      try {
        await access(outputPath);
        console.log(`  ⏭️  Already exists — skipping (use --force to overwrite)\n`);
        continue;
      } catch {
        // file doesn't exist, proceed
      }
    }

    try {
      const buffer = await sharp(join(inputDir, file))
        .trim()
        .resize({ width: 400 })
        .webp({ quality: 82 })
        .toBuffer();

      await writeFile(outputPath, buffer);
      console.log(`  ✅ Saved (${(buffer.length / 1024).toFixed(1)} KB)\n`);
    } catch (err) {
      console.error(`  ❌ Conversion failed:`, err);
    }
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
