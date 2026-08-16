/**
 * All site imagery in one place.
 * - placeholder = true  → grayscale Picsum photos (good for previewing layout)
 * - placeholder = false → your real photos from /public/images/
 */
const USE_PLACEHOLDERS = false;

const pic = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`;

const local = (name: string) => `/images/${name}`;

export const images = USE_PLACEHOLDERS
  ? {
      cover: pic("hs-cover-07", 1400, 1900),
      hero: pic("hs-hero-21", 1700, 1100),
      bride: pic("hs-bride-12", 900, 1200),
      groom: pic("hs-groom-04", 900, 1200),
      couple: pic("hs-couple-19", 1000, 1250),
      rsvp: pic("hs-rsvp-44", 1000, 1500),
      story: [
        pic("hs-story-31", 1500, 1000),
        pic("hs-story-58", 1000, 1500),
        pic("hs-story-77", 1500, 1000),
        pic("hs-story-12", 1000, 1500),
        pic("hs-story-64", 1500, 1000),
        pic("hs-story-89", 1000, 1500),
      ],
      gallery: [
        pic("hs-g-01", 900, 1200),
        pic("hs-g-02", 1200, 900),
        pic("hs-g-03", 1000, 1000),
        pic("hs-g-04", 900, 1300),
        pic("hs-g-05", 1200, 800),
        pic("hs-g-06", 1000, 1250),
        pic("hs-g-07", 900, 1150),
        pic("hs-g-08", 1100, 900),
        pic("hs-g-09", 1000, 1000),
        pic("hs-g-10", 950, 1300),
      ],
    }
  : {
      cover: local("cover.webp"),
      hero: local("hero.webp"),
      bride: local("bride.webp"),
      groom: local("groom.webp"),
      couple: local("couple.webp"),
      rsvp: local("rsvp.webp"),
      /** "The Story of Us" marquee, in the order they scroll past. */
      story: [
        local("story-1.webp"),
        local("story-2.webp"),
        local("story-3.webp"),
        local("story-4.webp"),
        local("story-5.webp"),
        local("story-6.webp"),
      ],
      /** Fixed shuffle of the client's set — deliberately not randomised at
       *  runtime, which would desync the server and client renders. */
      gallery: Array.from({ length: 20 }, (_, i) => local(`gallery-${i + 1}.webp`)),
    };

/** Narrow copies written beside each photograph by scripts/generate-image-sizes.mjs.
 *  Keep in sync with WIDTHS there. The 1200px original is the largest step. */
const GALLERY_WIDTHS = [400, 800] as const;
const GALLERY_INTRINSIC_WIDTH = 1200;

/** The candidate widths for one gallery photograph.
 *
 *  Placeholder mode serves remote Picsum URLs, which have no variants beside
 *  them — returning undefined there leaves the plain `src` to do the work. */
export function gallerySrcSet(src: string): string | undefined {
  if (!src.startsWith("/images/")) return undefined;
  const base = src.replace(/\.webp$/, "");
  return [
    ...GALLERY_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`),
    `${src} ${GALLERY_INTRINSIC_WIDTH}w`,
  ].join(", ");
}

/** How wide a gallery tile actually renders, mirroring the column layout in
 *  components/Gallery.tsx: two columns below `lg` and three above, inside a
 *  max-w-6xl (1152px) container with px-6 / sm:px-10 padding.
 *
 *  - < 640px   px-6 (24) + gap-4 (16) -> (100vw - 64) / 2
 *  - >= 640px  px-10 (40) + gap-5 (20) -> (100vw - 100) / 2
 *  - >= 1024px three columns, gap-6 (24 x 2) -> (100vw - 128) / 3
 *  - >= 1232px the container stops growing -> (1152 - 48) / 3 = 368px */
export const GALLERY_SIZES = [
  "(min-width: 1232px) 368px",
  "(min-width: 1024px) calc((100vw - 128px) / 3)",
  "(min-width: 640px) calc(50vw - 50px)",
  "calc(50vw - 32px)",
].join(", ");

/**
 * Cover background film — muted, autoplaying loop shown on the opening screen.
 * Poster is a still frame used before the video loads / if it can't play.
 */
export const coverVideo = {
  src: "/video/cover.mp4",
  poster: "/images/cover-poster.webp",
};