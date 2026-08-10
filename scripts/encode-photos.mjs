/**
 * Re-encodes the chosen prewedding originals into the webp files the site ships.
 *
 *   node scripts/encode-photos.mjs           # dry run — prints the plan
 *   node scripts/encode-photos.mjs --commit  # write public/images/*.webp
 *
 * The originals live in `prewed_photos/PreWed Invitation/`, which is gitignored
 * (66 files, 12–20MB each). Nothing in git otherwise records which original
 * became which slot, so SLOTS below is the mapping — keep it current when the
 * photography changes.
 *
 * Selections are the couple's own, given 2026-08-10.
 *
 * After running this, regenerate the share card, which crops cover.webp:
 *   node scripts/make-og-image.mjs
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "prewed_photos", "PreWed Invitation");
const OUT = path.join(root, "public", "images");

const COMMIT = process.argv.includes("--commit");

/**
 * `long` is the longest edge in the output; the other follows the original's
 * aspect ratio. Nothing is cropped — the cover and the story photos are framed
 * on the page as whole photographs, so a crop here would fight the layout.
 */
const SLOTS = [
  // Front invitation — the couple wanted this one held as a photograph, with
  // the type arranged around it rather than laid on top. It is framed rather
  // than full-bleed now, so it never renders taller than ~700px CSS; 1400 is
  // already 2x for that and keeps the largest image on first paint modest.
  { out: "cover.webp", src: "IMG_8197.JPG", long: 1400, quality: 82 },

  // Main photo — the studio full-length portrait.
  { out: "hero.webp", src: "IMG_9331.JPG", long: 1920, quality: 82 },

  // Backdrop of the RSVP card.
  { out: "rsvp.webp", src: "DSC05233-2.jpeg", long: 1800, quality: 80 },

  // "The Story of Us" marquee — six, in the order they scroll past.
  { out: "story-1.webp", src: "DSC04251.JPG", long: 1500, quality: 82 },
  { out: "story-2.webp", src: "DSC04688-2.JPG", long: 1500, quality: 82 },
  { out: "story-3.webp", src: "IMG_8192.JPG", long: 1500, quality: 82 },
  { out: "story-4.webp", src: "IMG_9329.JPG", long: 1500, quality: 82 },
  { out: "story-5.webp", src: "IMG_9324.JPG", long: 1500, quality: 82 },
  { out: "story-6.webp", src: "DSC05058.jpeg", long: 1500, quality: 82 },
];

/**
 * The Couple section's portrait predates this selection and was not part of it.
 * story-1.webp used to hold it and is now a marquee slot, so the file is
 * promoted to a name of its own before being overwritten above.
 */
const PRESERVE = { from: "story-1.webp", to: "couple.webp" };

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

// --- validate before writing anything -----------------------------------
let problems = 0;
for (const slot of SLOTS) {
  if (!fs.existsSync(path.join(SRC, slot.src))) {
    console.error(`✗ missing original: ${slot.src}`);
    problems++;
  }
}
if (problems) {
  console.error(`\n${problems} missing original(s) — aborting.`);
  process.exit(1);
}

// --- preserve the Couple portrait ---------------------------------------
const preserveFrom = path.join(OUT, PRESERVE.from);
const preserveTo = path.join(OUT, PRESERVE.to);
if (fs.existsSync(preserveTo)) {
  console.log(`· ${PRESERVE.to} already exists — leaving it alone`);
} else if (fs.existsSync(preserveFrom)) {
  console.log(`· ${PRESERVE.from} → ${PRESERVE.to} (before it is overwritten)`);
  if (COMMIT) fs.copyFileSync(preserveFrom, preserveTo);
} else {
  console.error(`✗ ${PRESERVE.from} is gone and ${PRESERVE.to} was never made.`);
  process.exit(1);
}

// --- encode --------------------------------------------------------------
for (const { out, src, long, quality } of SLOTS) {
  const meta = await sharp(path.join(SRC, src)).metadata();
  const portrait = meta.height >= meta.width;
  const resize = portrait ? { height: long } : { width: long };

  const pipeline = sharp(path.join(SRC, src))
    // Honours the EXIF orientation flag some of the iPhone frames carry, so
    // a photo that looks upright in Finder does not land on its side.
    .rotate()
    .resize({ ...resize, withoutEnlargement: true })
    .webp({ quality });

  const buf = await pipeline.toBuffer();
  const { width, height } = await sharp(buf).metadata();

  console.log(
    `  ${out.padEnd(14)} ← ${src.padEnd(18)} ${`${width}x${height}`.padEnd(11)} ${kb(buf.length)}`,
  );
  if (COMMIT) fs.writeFileSync(path.join(OUT, out), buf);
}

console.log(
  COMMIT
    ? `\n✓ Wrote ${SLOTS.length} files to public/images/.\n  Now run: node scripts/make-og-image.mjs`
    : "\nDry run. Re-run with --commit to write.",
);
