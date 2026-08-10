"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { images } from "@/lib/images";
import { wedding } from "@/lib/config";
import MaskText from "@/components/ui/MaskText";
import { FloralSprig } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

/** Alt text carries the names as well as the caption, so the photographs are
 *  findable in image search instead of being sixteen anonymous "First Light"s. */
const altFor = (caption: string) =>
  `${caption} — ${wedding.groom.name} and ${wedding.bride.name} prewedding photograph`;

const CAPTIONS = [
  "First Light",
  "The Promenade",
  "Hand in Hand",
  "Stillness",
  "Golden Hour",
  "Across the Water",
  "A Quiet Moment",
  "Side by Side",
  "The Promise",
  "Forever Begins",
];

const ASPECTS = [
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[5/4]",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[3/4]",
];

function GalleryItem({
  src,
  caption,
  aspect,
  index,
  onOpen,
}: {
  src: string;
  caption: string;
  aspect: string;
  index: string;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div
      ref={ref}
      className="group relative mb-4 block w-full cursor-pointer break-inside-avoid overflow-hidden sm:mb-5 lg:mb-6"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`View ${caption}`}
    >
      <motion.div
        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
        animate={{
          clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
        }}
        transition={{ duration: 1.2, ease }}
      >
        <div className={`${aspect} w-full overflow-hidden`}>
          <img
            src={src}
            alt={altFor(caption)}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover soft-tone transition-transform duration-[1100ms] ease-editorial group-hover:scale-[1.07]"
          />
        </div>
      </motion.div>

      {/* hover overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
        <div className="absolute inset-3 border border-ivory/30" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <span className="text-[11px] uppercase tracking-[0.28em] text-ivory">
            {caption}
          </span>
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
            alt={altFor(CAPTIONS[index % CAPTIONS.length])}
            className="max-h-[76vh] w-auto object-contain"
          />
        </div>
        <figcaption className="mt-4 flex items-center gap-4 text-ivory">
          <span className="text-[11px] uppercase tracking-[0.28em] text-ivory/80">
            {CAPTIONS[index % CAPTIONS.length]}
          </span>
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

      <div className="mx-auto mt-16 max-w-6xl columns-2 gap-4 sm:gap-5 lg:columns-3 lg:gap-6">
        {images.gallery.map((src, i) => (
          <GalleryItem
            key={i}
            src={src}
            caption={CAPTIONS[i % CAPTIONS.length]}
            aspect={ASPECTS[i % ASPECTS.length]}
            index={String(i + 1).padStart(2, "0")}
            onOpen={() => setOpen(i)}
          />
        ))}
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
