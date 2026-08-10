"use client";

import { motion } from "motion/react";
import { wedding } from "@/lib/config";
import { FloralSprig, FloralTwig, FloralDivider } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden bg-transparent px-6 py-24 text-ivory sm:py-32">
      <div className="pointer-events-none absolute inset-4 border border-ivory/15 sm:inset-6" />

      {/* Frosted panel — same reasoning as the countdown band: all light type,
          no opaque card of its own. */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center border border-ivory/15 bg-ink/65 px-6 py-16 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-12 sm:py-20">
        {/* monogram */}
        <motion.img
          src="/images/logo.webp"
          alt={`${wedding.groom.name} & ${wedding.bride.name} monogram`}
          width={513}
          height={640}
          loading="lazy"
          decoding="async"
          className="mb-8 h-20 w-auto opacity-90 sm:h-24"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 0.9, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
        />

        {/* ornament */}
        <div className="flex items-center gap-4">
          <FloralSprig className="text-taupe" />
          <motion.span
            className="text-taupe"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            ✦
          </motion.span>
          <FloralSprig flip className="text-taupe" />
        </div>

        <motion.p
          className="mt-7 text-[11px] uppercase tracking-[0.42em] text-ivory/85"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          With Love &amp; Gratitude
        </motion.p>

        <motion.h2
          className="mt-6 font-serif text-5xl font-light leading-[0.95] sm:text-7xl"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease, delay: 0.1 }}
        >
          {wedding.groom.name} <span className="italic text-taupe">&amp;</span>{" "}
          {wedding.bride.name}
        </motion.h2>

        <motion.p
          className="mt-7 max-w-md text-sm leading-relaxed text-ivory/85"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          Thank you for being part of our story. We cannot wait to begin this
          new chapter surrounded by the people we love most.
        </motion.p>

        {/* date / venue */}
        <div className="mt-9 flex items-center gap-4">
          <FloralTwig className="text-taupe" />
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.34em] text-ivory">
              {wedding.dateShort}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ivory/85">
              {wedding.venue.area}
            </p>
          </div>
          <FloralTwig flip className="text-taupe" />
        </div>

        {/* hashtag */}
        <p className="mt-9 font-serif text-2xl italic text-taupe">
          {wedding.hashtag}
        </p>

        {/* back to top */}
        <button
          onClick={toTop}
          className="group mt-12 flex flex-col items-center gap-2"
          aria-label="Back to top"
        >
          <motion.span
            className="text-ivory/85"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M12 20V4M5 11l7-7 7 7" />
            </svg>
          </motion.span>
          <span className="text-[9px] uppercase tracking-[0.32em] text-ivory/85 transition-colors duration-300 group-hover:text-ivory">
            Back to Top
          </span>
        </button>

        {/* credit */}
        <div className="mt-12 flex w-full flex-col items-center gap-3">
          <FloralDivider className="text-taupe/60" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/85">
            An Invitation Crafted with Love
          </p>
          <p className="text-[10px] uppercase tracking-[0.26em] text-ivory/75">
            © {wedding.year} · {wedding.groom.name} &amp; {wedding.bride.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
