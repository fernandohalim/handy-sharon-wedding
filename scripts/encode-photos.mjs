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
 * `long` is the longest edge in the output; the other follows the aspect ratio
 * of whatever is being resized. Nothing is cropped by default — the cover and
 * the story photos are framed on the page as whole photographs, so a crop here
 * would fight the layout.
 *
 * `crop` is the one exception: `{ left, top, width, height }` in the
 * original's own pixels, taken before the resize. Use it only where the page
 * wants a tighter frame than the photograph — cropping at encode time keeps
 * the output sharp, where a CSS `scale()` would just magnify a smaller file.
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

  // "The Beloved Couple" portrait — the couple's pick, 2026-08-12.
  //
  // The original is a wide vista: the two of them stand small on the steps
  // with a great deal of harbour around them, and at the size this section
  // renders they were barely readable. This is ~70% of the frame's width,
  // centred on them, at 3:4 upright.
  //
  // The vertical placement is set against what the section actually shows,
  // not against the file: ImageReveal renders the photo at h-[140%] for its
  // parallax, so only the middle ~71% is ever on screen. Framed to that
  // window the couple sit in the lower third with the sun's trail on the
  // water above them and a few steps below their feet — pushed any higher
  // and the parallax clips their shoes at mid-scroll. The horizon itself is
  // outside the window by design; it cannot be kept without either dropping
  // the zoom back to nothing or crowding the couple against the bottom.
  {
    out: "couple.webp",
    src: "DSC03579.jpeg",
    crop: { left: 686, top: 1900, width: 3300, height: 4400 },
    long: 1600,
    quality: 82,
  },

  // "The Story of Us" marquee — six, in the order they scroll past.
  { out: "story-1.webp", src: "DSC04251.JPG", long: 1500, quality: 82 },
  { out: "story-2.webp", src: "DSC04688-2.JPG", long: 1500, quality: 82 },
  { out: "story-3.webp", src: "IMG_8192.JPG", long: 1500, quality: 82 },
  { out: "story-4.webp", src: "IMG_9329.JPG", long: 1500, quality: 82 },
  { out: "story-5.webp", src: "IMG_9324.JPG", long: 1500, quality: 82 },
  { out: "story-6.webp", src: "DSC05058.jpeg", long: 1500, quality: 82 },
];

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

// --- encode --------------------------------------------------------------
for (const { out, src, crop, long, quality } of SLOTS) {
  const meta = await sharp(path.join(SRC, src)).metadata();
  // The crop decides the shape when there is one, so measure it, not the
  // original — otherwise an upright crop out of a wide frame resizes by the
  // wrong edge and lands at the wrong size.
  const { width: w, height: h } = crop ?? meta;
  const resize = h >= w ? { height: long } : { width: long };

  const pipeline = sharp(path.join(SRC, src))
    // Honours the EXIF orientation flag some of the iPhone frames carry, so
    // a photo that looks upright in Finder does not land on its side. Before
    // the extract, so `crop` is in upright pixels — the ones you measure off
    // the photo as you see it.
    .rotate();

  if (crop) pipeline.extract(crop);

  pipeline.resize({ ...resize, withoutEnlargement: true }).webp({ quality });

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
