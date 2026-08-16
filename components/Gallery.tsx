"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { GALLERY_SIZES, gallerySrcSet, images } from "@/lib/images";
import { wedding } from "@/lib/config";
import MaskText from "@/components/ui/MaskText";
import { FloralSprig } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

/** The captions are gone, but the alt text still carries the names and the
 *  plate number so the photographs stay findable in image search. */
const altFor = (index: string) =>
  `${wedding.groom.name} and ${wedding.bride.name} prewedding photograph ${index}`;

/** One [width, height] per photograph. The set is portrait 2:3 throughout
 *  except gallery-2, so that is the only landscape slot — the rest stay
 *  portrait-leaning to keep object-cover from cropping into faces.
 *
 *  These are applied as an inline aspect-ratio rather than a Tailwind class:
 *  the ratios are also what the column split below measures with, and Tailwind
 *  only emits arbitrary classes it can find as literal text in the source. */
const ASPECTS: readonly (readonly [number, number])[] = [
  [3, 4],
  [4, 3],
  [2, 3],
  [3, 4],
  [4, 5],
  [2, 3],
  [3, 4],
  [4, 5],
  [2, 3],
  [3, 4],
  [4, 5],
  [2, 3],
  [3, 4],
  [4, 5],
  [2, 3],
  [3, 4],
  [4, 5],
  [2, 3],
  [3, 4],
  [4, 5],
];

const ratioOf = (i: number) => ASPECTS[i % ASPECTS.length];

/** Assign each photograph to whichever column is currently shortest.
 *
 *  This replaces CSS multi-column. `columns-2` left the balancing to the
 *  browser, and Safari on iOS would push an `overflow-hidden`
 *  `break-inside-avoid` tile to the next column and strand a column-height
 *  hole behind it. Splitting the photographs ourselves is deterministic —
 *  same result in every engine, and identical on server and client since it
 *  depends only on the constants above. */
function splitIntoColumns(total: number, count: number) {
  const cols: number[][] = Array.from({ length: count }, () => []);
  const heights = new Array<number>(count).fill(0);

  for (let i = 0; i < total; i++) {
    const [w, h] = ratioOf(i);
    let shortest = 0;
    for (let c = 1; c < count; c++) {
      if (heights[c] < heights[shortest]) shortest = c;
    }
    cols[shortest].push(i);
    heights[shortest] += h / w;
  }
  return cols;
}

function GalleryItem({
  src,
  ratio,
  index,
  onOpen,
}: {
  src: string;
  ratio: readonly [number, number];
  index: string;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div
      ref={ref}
      className="group relative block w-full cursor-pointer overflow-hidden"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`View photograph ${index}`}
    >
      <motion.div
        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
        animate={{
          clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
        }}
        transition={{ duration: 1.2, ease }}
      >
        {/* No `soft-tone` here, deliberately. The desaturation reads as a
            wash over a wall of photographs, and the lightbox — which shows
            the same file untouched — made it obvious: the grid looked pale
            next to the version it opens into. The tiles and the lightbox now
            show the same photograph. */}
        <div
          className="w-full overflow-hidden"
          style={{ aspectRatio: `${ratio[0]} / ${ratio[1]}` }}
        >
          <img
            src={src}
            srcSet={gallerySrcSet(src)}
            sizes={GALLERY_SIZES}
            alt={altFor(index)}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-editorial group-hover:scale-[1.07]"
          />
        </div>
      </motion.div>

      {/* hover overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
        <div className="absolute inset-3 border border-ivory/30" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-end p-5">
          <span className="font-serif text-2xl italic text-ivory/85">
            {index}
          </span>
        </div>
        {/* expand hint */}
        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-ivory/40 bg-ink/25 backdrop-blur-sm">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="text-ivory"
          >
            <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const COLUMNS_NARROW = splitIntoColumns(images.gallery.length, 2);
const COLUMNS_WIDE = splitIntoColumns(images.gallery.length, 3);

function GalleryColumn({
  indices,
  onOpen,
}: {
  indices: number[];
  onOpen: (i: number) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-5 lg:gap-6">
      {indices.map((i) => (
        <GalleryItem
          key={i}
          src={images.gallery[i]}
          ratio={ratioOf(i)}
          index={String(i + 1).padStart(2, "0")}
          onOpen={() => onOpen(i)}
        />
      ))}
    </div>
  );
}

function Lightbox({
  index,
  onClose,
  onNav,
}: {
  index: number;
  onClose: () => void;
  onNav: (dir: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-5 backdrop-blur-sm sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease }}
      onClick={onClose}
    >
      {/* close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-ivory/40 text-ivory transition-colors duration-300 hover:bg-ivory/10 sm:right-8 sm:top-8"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* prev */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNav(-1);
        }}
        aria-label="Previous"
        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-ivory/40 text-ivory transition-colors duration-300 hover:bg-ivory/10 sm:left-8"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>

      {/* next */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNav(1);
        }}
        aria-label="Next"
        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-ivory/40 text-ivory transition-colors duration-300 hover:bg-ivory/10 sm:right-8"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <motion.figure
        key={index}
        className="relative flex max-h-full max-w-4xl flex-col items-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border border-ivory/25 p-2">
          <img
            src={images.gallery[index]}
            alt={altFor(String(index + 1).padStart(2, "0"))}
            className="max-h-[76vh] w-auto object-contain"
          />
        </div>
        <figcaption className="mt-4 flex items-center justify-center text-ivory">
          <span className="text-[11px] tracking-[0.2em] text-ivory/75">
            {String(index + 1).padStart(2, "0")} / {images.gallery.length}
          </span>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  const nav = useCallback((dir: number) => {
    setOpen((cur) => {
      if (cur === null) return cur;
      const n = images.gallery.length;
      return (cur + dir + n) % n;
    });
  }, []);

  // Lock scroll while the lightbox is open — tied to state (not the exit
  // animation) so the page never gets stuck locked if a close is interrupted.
  useEffect(() => {
    document.body.style.overflow = open !== null ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <section className="relative overflow-hidden bg-transparent px-6 py-24 sm:px-10 sm:py-32">
      <div className="on-film mx-auto flex max-w-6xl flex-col items-center text-center">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FloralSprig className="text-taupe" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-ivory/85">
            Moments Captured
          </span>
          <FloralSprig flip className="text-taupe" />
        </motion.div>

        <MaskText
          as="h2"
          text="The Gallery"
          className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ivory sm:text-6xl"
        />

        <motion.p
          className="mt-6 max-w-md text-sm leading-relaxed text-ivory/85"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          A collection of quiet glances and unguarded smiles — fragments of a
          love we can&apos;t wait to celebrate with you.
        </motion.p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-ivory/75">
          Tap any photo to view
        </p>
      </div>

      {/* Two arrangements of the same photographs — the narrow one is laid out
          in two columns, the wide one in three. Only one is ever displayed, and
          the hidden set costs nothing to speak of: `display: none` keeps the
          browser from fetching its lazy images. */}
      <div className="mx-auto mt-16 max-w-6xl">
        <div className="flex gap-4 sm:gap-5 lg:hidden">
          {COLUMNS_NARROW.map((col, c) => (
            <GalleryColumn key={c} indices={col} onOpen={setOpen} />
          ))}
        </div>
        <div className="hidden gap-6 lg:flex">
          {COLUMNS_WIDE.map((col, c) => (
            <GalleryColumn key={c} indices={col} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            key="lightbox"
            index={open}
            onClose={() => setOpen(null)}
            onNav={nav}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
