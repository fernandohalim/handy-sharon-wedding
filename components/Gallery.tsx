"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { images } from "@/lib/images";
import MaskText from "@/components/ui/MaskText";
import { FloralSprig } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

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
}: {
  src: string;
  caption: string;
  aspect: string;
  index: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div
      ref={ref}
      className="group relative mb-4 break-inside-avoid overflow-hidden sm:mb-5 lg:mb-6"
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
            alt={caption}
            loading="lazy"
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
          <span className="font-serif text-2xl italic text-ivory/65">
            {index}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <section className="relative overflow-hidden bg-paper px-6 py-24 text-ink sm:px-10 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FloralSprig className="text-taupe" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-stone">
            Moments Captured
          </span>
          <FloralSprig flip className="text-taupe" />
        </motion.div>

        <MaskText
          as="h2"
          text="The Gallery"
          className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ink sm:text-6xl"
        />

        <motion.p
          className="mt-6 max-w-md text-sm leading-relaxed text-stone"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          A collection of quiet glances and unguarded smiles — fragments of a
          love we can&apos;t wait to celebrate with you.
        </motion.p>
      </div>

      <div className="mx-auto mt-16 max-w-6xl columns-2 gap-4 sm:gap-5 lg:columns-3 lg:gap-6">
        {images.gallery.map((src, i) => (
          <GalleryItem
            key={i}
            src={src}
            caption={CAPTIONS[i % CAPTIONS.length]}
            aspect={ASPECTS[i % ASPECTS.length]}
            index={String(i + 1).padStart(2, "0")}
          />
        ))}
      </div>
    </section>
  );
}
