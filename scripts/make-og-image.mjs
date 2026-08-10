/**
 * Builds the 1200x630 social-share card used for link previews (WhatsApp,
 * iMessage, X, Facebook) and writes it where Next's file-based metadata
 * conventions pick it up: app/opengraph-image.jpg and app/twitter-image.jpg.
 *
 * Re-run it after swapping the photography:
 *   node scripts/make-og-image.mjs
 *
 * Text is drawn as SVG. The card is generated once and committed, so it renders
 * with whatever serif the generating machine has — Georgia stands in closely
 * for Cormorant Garamond at this size.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const W = 1200;
const H = 630;
const PHOTO_W = 456;
const TEXT_W = W - PHOTO_W;

// Design tokens mirrored from app/globals.css
const INK = "#33405c";
const PAPER = "#fdf5f8";
const TAUPE = "#c9789a";
const STONE = "#6f7891";

const SOURCE_PHOTO = "public/images/cover.webp";

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const COUPLE = "Handy & Sharon";
const EYEBROW = "THE WEDDING OF";
const DATE = "SATURDAY · 12 DECEMBER 2026";
const VENUE = "Harris Hotel & Residence Sunset Road · Denpasar, Bali";
const HASHTAG = "#HANDpickedforSHAR";

const PAD = 76;

const textPanel = `
<svg xmlns="http://www.w3.org/2000/svg" width="${TEXT_W}" height="${H}">
  <rect width="${TEXT_W}" height="${H}" fill="${PAPER}"/>

  <!-- ornamental double rule, echoing the cover's frame -->
  <rect x="34" y="34" width="${TEXT_W - 68}" height="${H - 68}"
        fill="none" stroke="${INK}" stroke-opacity="0.16" stroke-width="1"/>
  <rect x="41" y="41" width="${TEXT_W - 82}" height="${H - 82}"
        fill="none" stroke="${INK}" stroke-opacity="0.10" stroke-width="1"/>

  <text x="${PAD}" y="186" fill="${STONE}"
        font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="19" letter-spacing="7">${escape(EYEBROW)}</text>

  <!-- 74px keeps the longest line (the two names) inside the inner rule.
       Raising it runs the type under the photograph. -->
  <text x="${PAD}" y="286" fill="${INK}"
        font-family="Georgia, Cormorant Garamond, serif"
        font-size="74" font-weight="400">${escape(COUPLE)}</text>

  <line x1="${PAD}" y1="330" x2="${PAD + 92}" y2="330"
        stroke="${TAUPE}" stroke-width="2"/>

  <text x="${PAD}" y="396" fill="${INK}"
        font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="23" letter-spacing="4">${escape(DATE)}</text>

  <text x="${PAD}" y="436" fill="${STONE}"
        font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="19">${escape(VENUE)}</text>

  <text x="${PAD}" y="512" fill="${TAUPE}"
        font-family="Georgia, Cormorant Garamond, serif"
        font-size="30" font-style="italic">${escape(HASHTAG)}</text>
</svg>`;

// A soft ink edge where the photo meets the paper, so the seam reads as a
// deliberate join rather than two images butted together.
const seam = `
<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO_W}" height="${H}">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${INK}" stop-opacity="0.28"/>
      <stop offset="18%" stop-color="${INK}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${PHOTO_W}" height="${H}" fill="url(#s)"/>
  <rect x="24" y="24" width="${PHOTO_W - 48}" height="${H - 48}"
        fill="none" stroke="#eef2fb" stroke-opacity="0.4" stroke-width="1"/>
</svg>`;

const photo = await sharp(path.join(root, SOURCE_PHOTO))
  .resize(PHOTO_W, H, { fit: "cover", position: "attention" })
  .composite([{ input: Buffer.from(seam), top: 0, left: 0 }])
  .toBuffer();

const card = await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: PAPER,
  },
})
  .composite([
    { input: Buffer.from(textPanel), top: 0, left: 0 },
    { input: photo, top: 0, left: TEXT_W },
  ])
  .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
  .toBuffer();

const alt = `${COUPLE} — wedding on 12 December 2026 at Harris Hotel & Residence Sunset Road, Denpasar, Bali`;

for (const name of ["opengraph-image", "twitter-image"]) {
  await fs.writeFile(path.join(root, "app", `${name}.jpg`), card);
  await fs.writeFile(path.join(root, "app", `${name}.alt.txt`), alt);
}

console.log(
  `Wrote app/opengraph-image.jpg and app/twitter-image.jpg — ${W}x${H}, ${(
    card.length / 1024
  ).toFixed(0)}KB`,
);
