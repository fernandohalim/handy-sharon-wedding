"use client";

import { motion } from "motion/react";
import { images } from "@/lib/images";
import { wedding } from "@/lib/config";
import MaskText from "@/components/ui/MaskText";
import { FloralSprig } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

/** Seconds for one full pass. Slow enough to read a photograph as it goes by. */
const SPEED = 52;

/**
 * A line per photograph, in the order they scroll past. The captions carry the
 * alt text as well as the visible label, so the strip is not six anonymous
 * images to a screen reader or to image search.
 *
 * The dimensions are the encoded files' own (see scripts/encode-photos.mjs) and
 * have to stay in step with them. They matter here more than usual: the frames
 * are sized `h-full w-auto`, so without an intrinsic ratio to go on the browser
 * gives a not-yet-loaded photo a width of zero — the strip would start as a
 * blank band and shove itself sideways as each lazy frame arrived.
 */
const FRAMES: { caption: string; w: number; h: number }[] = [
  { caption: "By the Opera House", w: 1500, h: 1000 },
  { caption: "Close", w: 1000, h: 1500 },
  { caption: "Under the Bridge", w: 1500, h: 1000 },
  { caption: "Morning, at Home", w: 1002, h: 1500 },
  { caption: "The Garden Wall", w: 1500, h: 1002 },
  { caption: "Colonnade", w: 1000, h: 1500 },
];

const altFor = (caption: string) =>
  `${caption} — ${wedding.groom.name} and ${wedding.bride.name} prewedding photograph`;

/** One pass of the strip. Rendered twice so the loop has no seam. */
function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0" aria-hidden={hidden}>
      {images.story.map((src, i) => (
        <figure
          key={i}
          className="relative mx-3 h-full shrink-0 border border-ivory/20 bg-ink/20 p-1.5 sm:mx-4 sm:p-2"
        >
          {/* The photographs are a mix of upright and wide frames. Fixing the
              height and letting the width follow keeps every one uncropped and
              gives the strip its irregular, hand-laid rhythm. */}
          <img
            src={src}
            alt={altFor(FRAMES[i].caption)}
            width={FRAMES[i].w}
            height={FRAMES[i].h}
            loading="lazy"
            decoding="async"
            className="h-full w-auto max-w-none object-cover soft-tone"
          />
          <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between opacity-0 sm:opacity-100">
            <span className="text-[10px] uppercase tracking-[0.28em] text-ivory [text-shadow:0_1px_6px_rgba(10,14,24,0.9)]">
              {FRAMES[i].caption}
            </span>
            <span className="font-serif text-lg italic text-ivory/85 [text-shadow:0_1px_6px_rgba(10,14,24,0.9)]">
              {String(i + 1).padStart(2, "0")}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function Story() {
  return (
    <section className="relative overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="on-film mx-auto flex max-w-6xl flex-col items-center px-6 text-center sm:px-10">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FloralSprig className="text-taupe" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-ivory/85">
            Written Together
          </span>
          <FloralSprig flip className="text-taupe" />
        </motion.div>

        <MaskText
          as="h2"
          text="The Story of Us"
          className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ivory sm:text-6xl"
        />

        <motion.p
          className="mt-6 max-w-md text-sm leading-relaxed text-ivory/85"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          Ordinary days that turned out to be the whole story — harbour steps,
          quiet mornings, and every walk home in between.
        </motion.p>
      </div>

      {/* The strip runs full-bleed, edge to edge, so it reads as film passing
          rather than as a row of pictures inside the page's column. */}
      <motion.div
        className="mt-14 flex h-[15rem] sm:mt-16 sm:h-[21rem] lg:h-[26rem]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
      >
        <motion.div
          className="flex h-full"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: SPEED, ease: "linear", repeat: Infinity }}
        >
          <Row />
          {/* The duplicate exists only to make the loop seamless — it is the
              same six photographs, so it is hidden from assistive tech. */}
          <Row hidden />
        </motion.div>
      </motion.div>

      {/* Feathered edges, so photographs enter and leave instead of being
          chopped off at the viewport. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28"
        style={{
          background:
            "linear-gradient(to right, rgba(15,20,33,0.85), rgba(15,20,33,0))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28"
        style={{
          background:
            "linear-gradient(to left, rgba(15,20,33,0.85), rgba(15,20,33,0))",
        }}
      />
    </section>
  );
}
