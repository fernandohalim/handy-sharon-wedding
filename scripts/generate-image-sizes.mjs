/**
 * Generates the narrow variants the gallery serves through `srcset`.
 *
 * The photographs are stored at 1200px wide, but the gallery never renders a
 * tile wider than 368 CSS px — so a phone was downloading roughly four times
 * the pixels it could show. This writes a 400px and an 800px copy of each
 * photograph beside the original; `gallerySrcSet` in lib/images.ts points at
 * them and lets the browser pick.
 *
 * Runs as `prebuild`, so a deploy cannot ship variants that disagree with the
 * photographs they were made from — a stale variant would show the *previous*
 * picture to anyone on a small screen. Re-run by hand after swapping photos:
 *
 *     npm run images
 */
import { readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/** Keep in sync with GALLERY_WIDTHS in lib/images.ts. */
const WIDTHS = [400, 800];
const QUALITY = 82;
const DIR = path.join(process.cwd(), "public", "images");

/** `gallery-3.webp` yes; `gallery-3-400.webp` (a variant) no. */
const SOURCE = /^gallery-\d+\.webp$/;

const mtime = async (file) => {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return null;
  }
};

await mkdir(DIR, { recursive: true });
const files = (await readdir(DIR)).filter((f) => SOURCE.test(f)).sort();

if (files.length === 0) {
  console.warn("no gallery photographs found in public/images — nothing to do");
  process.exit(0);
}

let written = 0;
let skipped = 0;

for (const file of files) {
  const src = path.join(DIR, file);
  const srcTime = await mtime(src);
  const base = file.replace(/\.webp$/, "");

  for (const width of WIDTHS) {
    const out = path.join(DIR, `${base}-${width}.webp`);
    const outTime = await mtime(out);

    // Up to date already — leave it be so `prebuild` stays cheap.
    if (outTime !== null && outTime >= srcTime) {
      skipped++;
      continue;
    }

    await sharp(src).resize({ width }).webp({ quality: QUALITY }).toFile(out);
    written++;
  }
}

console.log(
  `gallery variants: ${written} written, ${skipped} already current ` +
    `(${files.length} photographs x ${WIDTHS.length} widths)`,
);
