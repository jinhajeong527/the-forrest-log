/**
 * Pose Image Generation Script
 *
 * Generates tarot card style yoga pose images using OpenAI gpt-image-1.5.
 * Uses an existing pose image as a style reference via images.edit().
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... pnpm tsx scripts/generate-pose-images.ts
 *   OPENAI_API_KEY=sk-... pnpm tsx scripts/generate-pose-images.ts --dry-run
 *   OPENAI_API_KEY=sk-... pnpm tsx scripts/generate-pose-images.ts --start 10 --end 50
 *   OPENAI_API_KEY=sk-... pnpm tsx scripts/generate-pose-images.ts --force
 *
 * Flags:
 *   --dry-run   Print what would be generated without calling the API
 *   --start N   Start from pose index N (1-based, default: 1)
 *   --end N     End at pose index N inclusive (default: last)
 *   --force     Overwrite existing images
 */

import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";

const OUTPUT_DIR = path.join(process.cwd(), "public/pose-images");
const POSES_JSON = path.join(process.cwd(), "scripts/forrest-poses.json");
const REFERENCE_IMAGE = path.join(process.cwd(), "docs/card-template.png");

// Delay between API calls to avoid rate limiting (ms)
const DELAY_MS = 3000;
// Max retries per image
const MAX_RETRIES = 3;

interface PoseEntry {
  name: string;
  sanskritName: string;
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

function buildPrompt(pose: PoseEntry, index: number): string {
  const roman = toRoman(index);
  return `Vintage tarot card illustration.
A single vertical tarot card centered in the image.
The full card must be fully visible and not cropped.
CARD LAYOUT (fixed structure):
Top to bottom layout must always be:
1. Roman numeral at the top center: "${roman}"
2. Curved banner with Sanskrit name: "${pose.sanskritName}"
3. Two crescent moons directly under the banner, left and right, symmetrical
4. Empty center area for the pose illustration
5. Bottom scroll banner with English pose name in capital letters: "${pose.name.toUpperCase()}"
The layout must be symmetrical and centered.
The center illustration must not overlap with the top or bottom banners.
CENTER ILLUSTRATION:
A female yoga practitioner performing the "${pose.name}" yoga pose.
The pose must be anatomically correct and clearly recognizable.
She wears an orange yoga top and beige leggings.
Long low ponytail.
FACE STYLE:
Simple illustrated face.
Clean line art face.
Minimal facial details.
Calm expression.
Eyes gently open.
Small nose and simple mouth.
Flat illustration style face.
CARD FRAME STYLE:
Use the provided reference image as the visual style and card frame template.
Ornate Art Nouveau tarot card frame.
Floral botanical decorations.
Crystals at bottom corners.
Warm beige parchment background.
Subtle stars and vintage paper texture.
Symmetrical vintage tarot design.
ILLUSTRATION STYLE:
Clean line art.
Thin ink lines.
Minimal shading.
Flat colors.
Vintage engraving illustration.
Sepia and warm beige color palette.
Vertical tarot card composition.
Plain or transparent background outside the card.`;
}

function toRoman(n: number): string {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateImage(
  client: OpenAI,
  referenceFile: File,
  pose: PoseEntry,
  number: number,
  outputPath: string,
  retries = 0
): Promise<void> {
  try {
    const response = await client.images.edit({
      model: "gpt-image-1.5",
      image: referenceFile,
      prompt: buildPrompt(pose, number),
      size: "1024x1536",
      quality: "medium",
      background: "transparent",
      output_format: "webp",
    });

    const base64 = response.data?.[0]?.b64_json;
    if (!base64) throw new Error("No image data in response");

    const buffer = Buffer.from(base64, "base64");
    fs.writeFileSync(outputPath, buffer);
  } catch (err: unknown) {
    if (retries < MAX_RETRIES) {
      const waitMs = DELAY_MS * (retries + 1);
      console.warn(
        `  Retry ${retries + 1}/${MAX_RETRIES} after ${waitMs}ms... (${(err as Error).message})`
      );
      await sleep(waitMs);
      return generateImage(client, referenceFile, pose, number, outputPath, retries + 1);
    }
    throw err;
  }
}

function getArg(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const startIdx = parseInt(getArg(args, "--start") ?? "1");
  const endArg = getArg(args, "--end");

  const poses: PoseEntry[] = JSON.parse(fs.readFileSync(POSES_JSON, "utf-8"));
  const endIdx = endArg ? parseInt(endArg) : poses.length;

  if (!dryRun && !process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  const client = dryRun ? null : new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const referenceBuffer = fs.readFileSync(REFERENCE_IMAGE);
  const referenceFile = new File([referenceBuffer], "reference.png", { type: "image/png" });

  console.log(`Generating poses ${startIdx}–${endIdx} of ${poses.length} total`);
  if (dryRun) console.log("DRY RUN — no API calls will be made\n");

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = startIdx - 1; i < endIdx; i++) {
    const pose = poses[i];
    const number = i + 1;
    const slug = toSlug(pose.name);
    const filename = `${number}-${slug}.webp`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    if (!force && fs.existsSync(outputPath)) {
      console.log(`[${number}/${poses.length}] SKIP  ${filename}`);
      skipped++;
      continue;
    }

    console.log(`[${number}/${poses.length}] GEN   ${filename}`);
    if (dryRun) {
      console.log(`       Prompt preview: ${buildPrompt(pose, number).substring(0, 80)}...`);
      generated++;
      continue;
    }

    try {
      await generateImage(client!, referenceFile, pose, number, outputPath);
      console.log(`       ✓ saved`);
      generated++;
    } catch (err) {
      console.error(`       ✗ failed: ${(err as Error).message}`);
      failed++;
    }

    if (i < endIdx - 1) await sleep(DELAY_MS);
  }

  console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
