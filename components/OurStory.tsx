"use client";

import { motion } from "motion/react";
import { images } from "@/lib/images";
import Reveal from "@/components/ui/Reveal";
import MaskText from "@/components/ui/MaskText";
import ImageReveal from "@/components/ui/ImageReveal";
import FilmStrip from "@/components/ui/FilmStrip";

const ease = [0.22, 1, 0.36, 1] as const;

// Placeholder story — replace text with the couple's real story.
const chapters = [
  {
    no: "01",
    year: "2019",
    title: "How We Met",
    text: "It began with an ordinary day made extraordinary — a chance meeting, a shared smile, and a conversation neither of them wanted to end. Two strangers slowly became each other's favorite person.",
  },
  {
    no: "02",
    year: "2021",
    title: "Growing Together",
    text: "Through seasons of laughter and quiet, ordinary moments, their bond only deepened. They learned each other's hearts and discovered that home was never a place — it was a person.",
  },
  {
    no: "03",
    year: "2025",
    title: "The Proposal",
    text: "Beneath an open sky, with the world glowing softly around them, one question changed everything. A trembling 'yes', a few happy tears, and the beginning of a promise meant to last a lifetime.",
  },
];

function Chapter({
  chapter,
  index,
  flip,
}: {
  chapter: (typeof chapters)[number];
  index: number;
  flip?: boolean;
}) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className={`pointer-events-none absolute -top-10 -z-10 font-serif text-[34vw] font-light leading-[0.7] text-ink/[0.06] lg:text-[21rem] ${
          flip ? "right-0" : "left-0"
        }`}
      >
        {chapter.no}
      </span>

      <div className="relative flex flex-col gap-8 lg:block">
        <ImageReveal
          src={images.story[index]}
          alt={chapter.title}
          speed={9}
          className={`aspect-[4/5] w-full lg:aspect-auto lg:h-[80vh] lg:w-[58%] ${
            flip ? "lg:ml-auto" : ""
          }`}
        />

        <motion.div
          initial={{ opacity: 0, x: flip ? -44 : 44 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className={`relative z-10 border border-ink/12 bg-ivory p-8 sm:p-11 lg:absolute lg:top-1/2 lg:w-[46%] lg:-translate-y-1/2 ${
            flip ? "lg:left-0" : "lg:right-0"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="font-serif text-5xl font-light italic text-taupe">
              {chapter.no}
            </span>
            <span className="h-px w-10 bg-ink/25" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-stone">
              {chapter.year}
            </span>
          </div>

          <MaskText
            as="h3"
            text={chapter.title}
            className="mt-6 font-serif text-3xl font-light leading-[1.05] text-ink sm:text-5xl"
          />

          <Reveal delay={0.15}>
            <span className="mt-5 block h-px w-12 bg-ink/25" />
            <p className="mt-5 text-sm leading-relaxed text-stone sm:text-[15px]">
              {chapter.text}
            </p>
          </Reveal>
        </motion.div>
      </div>
    </div>
  );
}

export default function OurStory() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 sm:py-32">
      {/* header */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center sm:px-10">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="h-px w-7 bg-ink/30" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-stone">
            Our Journey
          </span>
          <span className="h-px w-7 bg-ink/30" />
        </motion.div>
        <MaskText
          as="h2"
          text="The Story of Us"
          className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ink sm:text-6xl"
        />
        <motion.p
          className="mt-6 max-w-md text-sm leading-relaxed text-stone"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          Every love story is beautiful, but ours is our favorite — told in
          three chapters that led us here.
        </motion.p>
      </div>

      {/* film reel */}
      <div className="mt-16">
        <FilmStrip images={images.gallery} />
      </div>

      {/* chapters */}
      <div className="mx-auto mt-24 flex max-w-6xl flex-col gap-36 px-6 sm:px-10 lg:gap-48">
        {chapters.map((c, i) => (
          <Chapter key={c.no} chapter={c} index={i} flip={i % 2 === 1} />
        ))}
      </div>

      {/* closing line */}
      <div className="mx-auto mt-28 max-w-md px-6 text-center">
        <Reveal>
          <span className="mx-auto block h-px w-10 bg-ink/30" />
          <p className="mt-6 font-serif text-2xl italic leading-relaxed text-ink sm:text-3xl">
            &ldquo;And so, the best chapter is about to begin.&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}
