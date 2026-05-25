"use client";

import { motion } from "motion/react";
import { wedding } from "@/lib/config";
import { images } from "@/lib/images";
import Reveal from "@/components/ui/Reveal";
import MaskText from "@/components/ui/MaskText";
import ImageReveal from "@/components/ui/ImageReveal";
import Marquee from "@/components/ui/Marquee";

const ease = [0.22, 1, 0.36, 1] as const;

function Person({
  index,
  ghost,
  label,
  fullName,
  parents,
  bio,
  instagram,
  image,
  flip,
}: {
  index: string;
  ghost: string;
  label: string;
  fullName: string;
  parents: string;
  bio: string;
  instagram: string;
  image: string;
  flip?: boolean;
}) {
  return (
    <div className="relative">
      {/* ghost name */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -top-6 -z-10 font-serif text-[26vw] italic leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(244,240,233,0.12)] lg:text-[14rem] ${
          flip ? "right-0" : "left-0"
        }`}
      >
        {ghost}
      </span>

      <div className="relative flex flex-col gap-8 lg:block">
        {/* image */}
        <ImageReveal
          src={image}
          alt={fullName}
          speed={9}
          className={`aspect-[4/5] w-full lg:aspect-auto lg:h-[82vh] lg:w-[62%] ${
            flip ? "lg:ml-auto" : ""
          }`}
        />

        {/* overlapping detail panel */}
        <motion.div
          initial={{ opacity: 0, x: flip ? -44 : 44 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-110px" }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          className={`relative z-10 border border-ivory/15 bg-ink p-8 sm:p-11 lg:absolute lg:top-1/2 lg:w-[44%] lg:-translate-y-1/2 ${
            flip ? "lg:left-0" : "lg:right-0"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="font-serif text-5xl font-light italic text-taupe">
              {index}
            </span>
            <span className="h-px w-10 bg-ivory/25" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-ivory/60">
              {label}
            </span>
          </div>

          <MaskText
            as="h3"
            text={fullName}
            className="mt-6 font-serif text-4xl font-light leading-[1.05] text-ivory sm:text-5xl"
          />

          <Reveal delay={0.15}>
            <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-ivory/45">
              {parents}
            </p>
            <span className="mt-5 block h-px w-12 bg-ivory/25" />
            <p className="mt-5 text-sm leading-relaxed text-ivory/70">{bio}</p>
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noreferrer"
              className="group/ig mt-7 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-ivory"
            >
              <span className="relative">
                @{instagram}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ivory transition-transform duration-500 ease-editorial group-hover/ig:scale-x-100" />
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </Reveal>
        </motion.div>
      </div>
    </div>
  );
}

export default function Couple() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink px-6 py-24 text-ivory sm:px-10 sm:py-36">
        <div className="mx-auto max-w-6xl">
          {/* header */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="h-px w-7 bg-ivory/40" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-ivory/70">
                With Joyful Hearts
              </span>
              <span className="h-px w-7 bg-ivory/40" />
            </motion.div>
            <MaskText
              as="h2"
              text="The Beloved Couple"
              className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ivory sm:text-6xl"
            />
            <motion.p
              className="mt-6 max-w-md text-sm leading-relaxed text-ivory/55"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
            >
              Brought together by chance, bound together by love — the two
              people about to begin a lifetime as one.
            </motion.p>
          </div>

          {/* profiles */}
          <div className="mt-24 flex flex-col gap-36 sm:mt-28 lg:gap-48">
            <Person
              index="I"
              ghost={wedding.groom.name}
              label="The Groom"
              fullName={wedding.groom.fullName}
              parents={wedding.groom.parents}
              bio="Warm, steady, and quietly thoughtful — Handy is the kind of person who makes everyone around him feel at ease. [Placeholder bio — replace with a personal description.]"
              instagram={wedding.groom.instagram}
              image={images.groom}
            />
            <Person
              index="II"
              ghost={wedding.bride.name}
              label="The Bride"
              fullName={wedding.bride.fullName}
              parents={wedding.bride.parents}
              bio="Bright, kind-hearted, and full of gentle grace — Sharon brings light into every room she enters. [Placeholder bio — replace with a personal description.]"
              instagram={wedding.bride.instagram}
              image={images.bride}
              flip
            />
          </div>
        </div>
      </section>
    </>
  );
}
