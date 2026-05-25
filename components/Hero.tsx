"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { wedding } from "@/lib/config";
import { images } from "@/lib/images";

const ease = [0.22, 1, 0.36, 1] as const;

// Fixed dust field (no hydration mismatch). Light motes sit over the
// photo (right), darker ones over the ivory (left).
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

  // depth layers
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
      className="relative min-h-[100svh] overflow-hidden bg-ivory"
    >
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
      <div className="pointer-events-none absolute inset-3 z-30 border border-ink/12 sm:inset-5" />

      {/* vertical edge labels */}
      <div className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <span className="block -rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.5em] text-stone">
          Handy &amp; Sharon
        </span>
      </div>
      <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <span className="block rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.5em] text-stone">
          Est. MMXXVI
        </span>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[88rem] grid-cols-1 lg:grid-cols-12">
        {/* LEFT */}
        <div className="relative flex flex-col justify-between gap-14 px-7 pb-16 pt-24 sm:px-12 sm:pt-28 lg:col-span-7 lg:gap-8 lg:pl-20">
          {/* metadata */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
          >
            <span className="eyebrow">The Wedding Of</span>
            <span className="flex items-center gap-3">
              <motion.span
                className="hidden h-px bg-ink/25 sm:block"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ duration: 1, ease, delay: 1 }}
              />
              <span className="eyebrow">No. 01</span>
            </span>
          </motion.div>

          {/* names */}
          <div className="relative">
            {/* breathing ghost ampersand */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ x: ghostX, y: ghostY }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 1.2 }}
            >
              <motion.span
                className="block font-serif text-[42vw] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(28,26,23,0.10)] lg:text-[26rem]"
                animate={{ scale: [1, 1.045, 1], rotate: [0, 2.2, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                &amp;
              </motion.span>
            </motion.span>

            <motion.div style={{ x: nameX, y: nameY }}>
              <motion.p
                className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-stone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                <motion.span
                  className="text-taupe"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  ✦
                </motion.span>
                We Are Getting Married
              </motion.p>

              <h1 className="relative font-serif font-light leading-[0.84] text-ink">
                <RiseWord delay={1} className="text-[clamp(3.6rem,14vw,10rem)]">
                  {wedding.groom.name}
                </RiseWord>
                <span className="mt-1 flex items-center gap-4 pl-[16%] sm:gap-7">
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
                    className="text-[clamp(3.6rem,14vw,10rem)]"
                  >
                    {wedding.bride.name}
                  </RiseWord>
                </span>
              </h1>
            </motion.div>
          </div>

          {/* bottom row */}
          <motion.div
            className="flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.5 }}
          >
            <motion.div
              style={{ x: secX, y: secY }}
              className="border border-ink/15 p-1.5"
            >
              <div className="relative h-40 w-32 overflow-hidden sm:h-44 sm:w-36">
                <motion.img
                  src={images.gallery[2]}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.6, ease, delay: 1.7 }}
                />
              </div>
            </motion.div>

            <div className="flex-1">
              <motion.span
                className="block h-px bg-ink/30"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 1, ease, delay: 1.8 }}
              />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone">
                Two hearts, one promise. We invite you to witness the beginning
                of our forever.
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] uppercase tracking-[0.34em] text-stone">
                Save the Date
              </p>
              <p className="mt-2 font-serif text-3xl text-ink sm:text-[2.6rem]">
                {wedding.dateShort}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-stone">
                {wedding.venue.area}
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT image */}
        <div className="relative min-h-[56vh] lg:col-span-5 lg:min-h-0">
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.4, ease, delay: 0.9 }}
          >
            {/* mouse-parallax layer */}
            <motion.div
              className="absolute inset-0 scale-[1.14]"
              style={{ x: imgX, y: imgY }}
            >
              {/* ken burns layer */}
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
                  alt="Handy and Sharon"
                  className="h-full w-full object-cover grayscale"
                />
              </motion.div>
            </motion.div>

            {/* light sweep */}
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

          {/* date stamp */}
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
    </section>
  );
}
