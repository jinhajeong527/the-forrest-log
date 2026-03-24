# Story 09: Tarot card pose image generation via OpenAI

**Epic:** epic-02-pose-library
**Status:** in progress

## Goal

As a developer, I want to batch-generate tarot card style illustrations for all 297 Forrest Yoga poses using OpenAI's image API, so the pose library has consistent visual assets at scale.

## Background

- 4 reference images already exist in `public/pose-images/` (hand-crafted tarot card style)
- `scripts/forrest-poses.json` contains 297 poses with `name`, `sanskritName`, and `categories`
- New images must match the existing style: vintage tarot card, ornate frame, orange/sepia palette

## Acceptance Criteria

- [ ] `scripts/generate-pose-images.ts` generates WebP images for all poses not yet in `public/pose-images/`
- [ ] Each image uses `docs/1. downward pacing dog.png` as style reference via `images.edit()` (gpt-image-1.5)
- [ ] Output filename follows the convention: `{index}-{slug}.webp`
- [ ] Prompt injects the correct English name and Sanskrit name per pose
- [ ] `--dry-run` flag previews what would be generated without API calls
- [ ] `--start N --end N` flags allow generating a range (for batching / cost control)
- [ ] `--force` flag regenerates images that already exist
- [ ] Failed images are logged and skipped (no crash); can be retried in a subsequent run
- [ ] After generation, `prisma/seed.ts` registers all images into the DB

## Technical Notes

- Model: `gpt-image-1.5`, size `1024x1536`, quality `medium` (~$0.07/image)
- 297 images × $0.07 ≈ $20.79 estimated total cost
- Uses `images.edit()` with `docs/1. downward pacing dog.png` as style reference
- Output: raw WebP from API (no sharp post-processing), `background: transparent`
- Rate limiting: 3-second delay between calls; max 3 retries with backoff
- `pnpm pose:generate` runs the script
- `OPENAI_API_KEY` must be set in environment
