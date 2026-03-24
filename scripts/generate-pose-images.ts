/**
 * Pose Image Generation Script
 *
 * Generates tarot card style yoga pose images using OpenAI gpt-image-1.
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
import sharp from "sharp";

const OUTPUT_DIR = path.join(process.cwd(), "public/pose-images");
const POSES_JSON = path.join(process.cwd(), "scripts/forrest-poses.json");
const REFERENCE_IMAGE = path.join(process.cwd(), "docs/1. downward pacing dog.png");

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
  return `Vintage tarot card style illustration of a yoga pose.
A single vertical tarot card centered in the image. The card should occupy about 85-90% of the image height with a small margin on all sides. The full tarot card must be completely visible — do not crop any part of the card.
The tarot card has an ornate Art Nouveau style border with a rounded arch at the top. The border is decorated with floral and botanical engravings. There are decorative crystals at the bottom left and bottom right corners of the frame.
Inside the card is a warm beige parchment background with subtle small star symbols and vintage paper texture.
Layout from top to bottom:
- At the very top inside the arch: Roman numeral "${roman}" at the top center.
- Below the arch: a curved scroll banner containing the Sanskrit pose name written in Latin/Roman alphabet letters only (NOT Devanagari or any other non-Latin script): "${pose.sanskritName}".
- Two crescent moons are positioned directly below the Sanskrit banner, one on the left and one on the right, symmetrically. They curl inward facing each other, attached to the lower edge of the banner. The moons must always appear in this fixed position between the Sanskrit banner and the center illustration. Do not move them elsewhere.
- Center area: leave clear open space for the character illustration.
- At the bottom of the card: a scroll banner containing the English pose name in capital letters: "${pose.name.toUpperCase()}".
The layout is symmetrical and centered. The top and bottom banners must not overlap with the center illustration.
In the center, a female yoga practitioner performing the "${pose.name}" yoga pose. The body position must accurately represent the ${pose.name} — generate the correct pose based on its name.
She wears an orange yoga top and beige leggings. Hair is tied in a long low ponytail.
The practitioner's face must be clearly rendered with distinct facial features — eyes, nose, and lips visible, even in profile or three-quarter view. Do not leave the face vague, blurred, or featureless.
Illustration style: clean line art, thin ink lines, minimal shading, flat colors, slightly textured like vintage print, vintage engraving style.
Color palette: warm sepia, beige, and soft orange tones.
Vertical composition, tarot card poster layout.
No background outside the card — transparent or plain background only.`
;
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
  pose: PoseEntry,
  number: number,
  outputPath: string,
  retries = 0
): Promise<void> {
  try {
    const referenceBuffer = fs.readFileSync(REFERENCE_IMAGE);
    const referenceFile = new File([referenceBuffer], "reference.png", {
      type: "image/png",
    });

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
      return generateImage(client, pose, number, outputPath, retries + 1);
    }
    throw err;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const startIdx = parseInt(args[args.indexOf("--start") + 1] ?? "1");
  const endArg = args[args.indexOf("--end") + 1];

  const poses: PoseEntry[] = JSON.parse(fs.readFileSync(POSES_JSON, "utf-8"));
  const endIdx = endArg ? parseInt(endArg) : poses.length;

  if (!dryRun && !process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  const client = dryRun ? null : new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
      await generateImage(client!, pose, number, outputPath);
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
