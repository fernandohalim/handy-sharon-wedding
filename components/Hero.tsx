"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { wedding } from "@/lib/config";
import { gallerySrcSet, images } from "@/lib/images";

const ease = [0.22, 1, 0.36, 1] as const;

const PARTICLES = [
  { x: "14%", y: "26%", s: 3, d: 11, delay: 0.0, drift: 30, c: "bg-ink/25" },
  { x: "22%", y: "62%", s: 5, d: 14, delay: 1.4, drift: 40, c: "bg-ink/15" },
  { x: "38%", y: "18%", s: 2, d: 9, delay: 0.6, drift: 24, c: "bg-taupe/40" },
  { x: "9%", y: "78%", s: 4, d: 13, delay: 2.0, drift: 34, c: "bg-ink/20" },
  { x: "46%", y: "70%", s: 3, d: 12, delay: 0.9, drift: 28, c: "bg-ink/20" },
  { x: "33%", y: "44%", s: 2, d: 10, delay: 1.8, drift: 22, c: "bg-taupe/35" },
  { x: "63%", y: "30%", s: 4, d: 13, delay: 0.4, drift: 36, c: "bg-ivory/45" },
  { x: "78%", y: "58%", s: 3, d: 11, delay: 1.2, drift: 30, c: "bg-ivory/40" },
  { x: "88%", y: "24%", s: 5, d: 15, delay: 2.4, drift: 44, c: "bg-ivory/35" },
  { x: "71%", y: "82%", s: 2, d: 9, delay: 0.7, drift: 22, c: "bg-ivory/50" },
  { x: "92%", y: "67%", s: 3, d: 12, delay: 1.6, drift: 30, c: "bg-ivory/40" },
  { x: "57%", y: "12%", s: 2, d: 10, delay: 2.1, drift: 20, c: "bg-ivory/40" },
];

function RiseWord({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.2em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "120%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.2, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const sx = useSpring(mvX, { stiffness: 55, damping: 18, mass: 0.6 });
  const sy = useSpring(mvY, { stiffness: 55, damping: 18, mass: 0.6 });

  const imgX = useTransform(sx, [-0.5, 0.5], [20, -20]);
  const imgY = useTransform(sy, [-0.5, 0.5], [20, -20]);
  const nameX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const nameY = useTransform(sy, [-0.5, 0.5], [-8, 8]);
  const ghostX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const ghostY = useTransform(sy, [-0.5, 0.5], [16, -16]);
  const sealX = useTransform(sx, [-0.5, 0.5], [-34, 34]);
  const sealY = useTransform(sy, [-0.5, 0.5], [-26, 26]);
  const partX = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const partY = useTransform(sy, [-0.5, 0.5], [-20, 20]);
  const secX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const secY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  const onMove = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mvX.set((e.clientX - r.left) / r.width - 0.5);
    mvY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-[100svh] overflow-hidden bg-transparent"
    >
      {/* Steadies the bottom edge, which carries the verse and the scroll cue
          over the busiest part of the frame. Deliberately gentle — a heavier
          wash here reads as a grey slab over the film. The type itself relies
          on `on-film` below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 32%, rgba(0,0,0,0) 50%)",
        }}
      />

      {/* floating dust */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20"
        style={{ x: partX, y: partY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.4 }}
      >
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className={`absolute rounded-full ${p.c}`}
            style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
            animate={{ y: [0, -p.drift, 0], opacity: [0, 0.9, 0] }}
            transition={{
              duration: p.d,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* cinematic vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{ boxShadow: "inset 0 0 200px rgba(28,26,23,0.13)" }}
      />

      {/* frame */}
      <div className="pointer-events-none absolute inset-3 z-30 border border-ivory/15 sm:inset-5" />

      {/* vertical edge labels */}
      <div className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <span className="block -rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.5em] text-ivory/85">
          Handy &amp; Sharon
        </span>
      </div>
      <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <span className="block rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.5em] text-ivory/85">
          Est. MMXXVI
        </span>
      </div>

      <div className="on-film relative z-10 mx-auto grid max-w-[88rem] grid-cols-1 lg:min-h-[100svh] lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto]">
        {/* METADATA */}
        <motion.div
          className="flex items-center justify-between px-7 pb-2 pt-24 sm:px-12 lg:col-span-7 lg:row-start-1 lg:pb-0 lg:pl-20 lg:pr-12 lg:pt-28"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.7 }}
        >
          <span className="eyebrow text-ivory/85">The Wedding Of</span>
          <span className="font-serif text-lg italic text-taupe sm:text-xl">
            {wedding.hashtag}
          </span>
        </motion.div>

        {/* NAMES */}
        <div className="relative flex items-center px-7 py-8 sm:px-12 lg:col-span-7 lg:row-start-2 lg:py-6 lg:pl-20 lg:pr-12">
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ x: ghostX, y: ghostY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.2 }}
          >
            {/* text-shadow:none — the glyph is transparent with only a stroke,
                so an inherited shadow would render as a dark blob behind it */}
            <motion.span
              className="block font-serif text-[46vw] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(238,242,251,0.16)] [text-shadow:none] lg:text-[26rem]"
              animate={{ scale: [1, 1.045, 1], rotate: [0, 2.2, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              &amp;
            </motion.span>
          </motion.span>

          <motion.div style={{ x: nameX, y: nameY }} className="w-full">
            <motion.p
              className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.38em] text-ivory/85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <motion.span
                className="text-taupe"
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              >
                ✦
              </motion.span>
              We Are Getting Married
            </motion.p>

            <h1 className="relative font-serif font-light leading-[0.84] text-ivory">
              <RiseWord delay={1} className="text-[clamp(3.4rem,15vw,10rem)]">
                {wedding.groom.name}
              </RiseWord>
              <span className="mt-1 flex items-center gap-3 pl-[12%] sm:gap-7">
                <motion.span
                  className="font-serif text-5xl italic text-taupe sm:text-7xl"
                  initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease, delay: 1.25 }}
                >
                  &amp;
                </motion.span>
                <RiseWord
                  delay={1.15}
                  className="text-[clamp(3.4rem,15vw,10rem)]"
                >
                  {wedding.bride.name}
                </RiseWord>
              </span>
              {/* The design wants two words; a search result and a screen
                  reader want the whole sentence. This gives both. */}
              <span className="sr-only">
                {" "}
                — Wedding, {wedding.dateLong}, at {wedding.venue.name},{" "}
                {wedding.venue.area}
              </span>
            </h1>
          </motion.div>
        </div>

        {/* IMAGE */}
        <div className="px-7 pb-2 sm:px-12 lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:p-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:h-full">
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.4, ease, delay: 0.9 }}
            >
              <motion.div
                className="absolute inset-0 scale-[1.14]"
                style={{ x: imgX, y: imgY }}
              >
                <motion.div
                  className="h-full w-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={images.hero}
                    alt={`${wedding.groom.fullName} and ${wedding.bride.fullName} photographed in Sydney`}
                    width={1282}
                    height={1920}
                    decoding="async"
                    className="h-full w-full object-cover soft-tone"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-ivory/25 to-transparent mix-blend-overlay"
                animate={{ x: ["0%", "420%"] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 4,
                }}
              />
              <div className="pointer-events-none absolute inset-4 border border-ivory/25" />
            </motion.div>

            <motion.div
              className="absolute bottom-5 left-5 z-10 border border-ivory/40 bg-ink/25 px-4 py-2 backdrop-blur-sm"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 2 }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-ivory">
                Sydney · 2025
              </span>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <motion.div
          className="flex flex-col gap-7 px-7 pb-20 pt-8 sm:px-12 lg:col-span-7 lg:row-start-3 lg:flex-row lg:items-end lg:gap-10 lg:pb-14 lg:pl-20 lg:pr-12 lg:pt-0"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.5 }}
        >
          {/* secondary image — desktop only */}
          <motion.div
            style={{ x: secX, y: secY }}
            className="hidden shrink-0 border border-ivory/20 p-1.5 lg:block"
          >
            <div className="relative h-44 w-36 overflow-hidden">
              <motion.img
                src={images.gallery[2]}
                srcSet={gallerySrcSet(images.gallery[2])}
                /* Fixed at w-36 (144px) on the only breakpoint that shows it,
                   so the width is stated outright rather than as a viewport
                   fraction: 400w covers 2x, 800w covers 3x. */
                sizes="144px"
                alt={`${wedding.groom.name} and ${wedding.bride.name} — prewedding portrait`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover soft-tone"
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.6, ease, delay: 1.7 }}
              />
            </div>
          </motion.div>

          {/* intro line */}
          <div className="flex-1">
            <motion.span
              className="block h-px bg-ivory/30"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1, ease, delay: 1.8 }}
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/85">
              Two hearts, one promise. We invite you to witness the beginning of
              our forever.
            </p>
          </div>

          {/* scripture verse */}
          <div className="border-t border-ivory/20 pt-5 lg:max-w-xs lg:border-t-0 lg:pt-0 lg:text-right">
            <p className="text-[10px] uppercase tracking-[0.34em] text-ivory/85">
              A Blessing
            </p>
            <p className="mt-3 font-serif text-xl italic leading-snug text-ivory sm:text-2xl">
              &ldquo;Above all, love each other deeply, for love covers over a
              multitude of sins.&rdquo;
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.32em] text-ivory/85">
              1 Peter 4:8
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
