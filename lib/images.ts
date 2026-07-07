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
      story: [
        pic("hs-story-31", 1000, 1250),
        pic("hs-story-58", 1000, 1250),
        pic("hs-story-77", 1000, 1250),
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
      story: [
        local("story-1.webp"),
        local("story-2.webp"),
        local("story-3.webp"),
      ],
      gallery: [
        local("gallery-1.webp"),
        local("gallery-2.webp"),
        local("gallery-3.webp"),
        local("gallery-4.webp"),
        local("gallery-5.webp"),
        local("gallery-6.webp"),
        local("gallery-7.webp"),
        local("gallery-8.webp"),
        local("gallery-9.webp"),
        local("gallery-10.webp"),
      ],
    };

/**
 * Cover background film — muted, autoplaying loop shown on the opening screen.
 * Poster is a still frame used before the video loads / if it can't play.
 */
export const coverVideo = {
  src: "/video/cover.mp4",
  poster: "/images/cover-poster.webp",
};