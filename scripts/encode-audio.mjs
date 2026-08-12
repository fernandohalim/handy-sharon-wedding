/**
 * Re-encodes the chosen song into the file the site ships.
 *
 *   node scripts/encode-audio.mjs           # dry run — prints the plan
 *   node scripts/encode-audio.mjs --commit  # write public/audio/song.mp3
 *
 * The original lives in `prewed_photos/` beside the rest of the raw material,
 * which is gitignored — so, as with scripts/encode-photos.mjs, this file is the
 * only record of what the shipped audio was made from.
 *
 * Chosen by the couple, 2026-08-12: "Lifetime" — Justin Bieber (Justice).
 * A commercial recording, published here under no licence the couple hold.
 * That is their call to make, but it is the reason this file names the source
 * rather than quietly laundering it.
 *
 * ## What the re-encode is for
 *
 * The original is a 320kbps download with the album cover embedded as a video
 * stream — 8.4MB, which is more than the entire rest of the site put together
 * and most of it is inaudible under a page nobody opened to listen to. So:
 *
 *   - the cover art stream is dropped (`-vn`)
 *   - the bitrate comes down to something a phone on 4G will stream happily
 *   - loudness is normalised so the track sits *under* the page instead of
 *     announcing itself
 *
 * No trimming and no loop seam: the song already ends in a two-second decay to
 * silence and opens quietly, so `<audio loop>` restarts it cleanly on its own.
 */
import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "prewed_photos", "Lifetime.mp3");
const OUT_DIR = path.join(root, "public", "audio");
const OUT = path.join(OUT_DIR, "song.mp3");

const COMMIT = process.argv.includes("--commit");

/**
 * Background music at half volume on a phone speaker. 112k stereo is the point
 * where dropping further starts to audibly thin the cymbals without buying
 * back much size.
 */
const BITRATE = "112k";
/**
 * Integrated loudness target. Quieter than the -14 LUFS a streaming service
 * would master to: this plays under a page, and the player opens at just over
 * half volume on top of it.
 */
const LUFS = -18;

if (!fs.existsSync(SRC)) {
  console.error(`✗ missing original: ${path.relative(root, SRC)}`);
  process.exit(1);
}

console.log(`  song.mp3  ← ${path.basename(SRC)}`);
console.log(`            ${BITRATE} stereo, normalised to ${LUFS} LUFS, cover art stripped`);

if (!COMMIT) {
  console.log("\nDry run. Re-run with --commit to write.");
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

execFileSync(
  ffmpeg.path,
  [
    "-y",
    "-i", SRC,
    // The album cover rides along as an mjpeg video stream; -vn drops it.
    "-vn",
    "-af", `loudnorm=I=${LUFS}:TP=-1.5:LRA=11`,
    "-c:a", "libmp3lame",
    "-b:a", BITRATE,
    "-ar", "44100",
    "-ac", "2",
    // Carried through deliberately — the file should say whose it is.
    "-map_metadata", "0",
    "-id3v2_version", "3",
    OUT,
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

const before = fs.statSync(SRC).size;
const after = fs.statSync(OUT).size;
console.log(
  `            ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`,
);
console.log(`\n✓ Wrote ${path.relative(root, OUT)}.`);
