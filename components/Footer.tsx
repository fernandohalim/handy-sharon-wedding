"use client";

import { motion } from "motion/react";
import { wedding } from "@/lib/config";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden bg-ink px-6 py-24 text-ivory sm:py-32">
      <div className="pointer-events-none absolute inset-4 border border-ivory/12 sm:inset-6" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* ornament */}
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-ivory/25" />
          <motion.span
            className="text-taupe"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            ✦
          </motion.span>
          <span className="h-px w-12 bg-ivory/25" />
        </div>

        <motion.p
          className="mt-7 text-[11px] uppercase tracking-[0.42em] text-ivory/60"
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
          className="mt-7 max-w-md text-sm leading-relaxed text-ivory/55"
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
          <span className="h-px w-8 bg-ivory/25" />
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.34em] text-ivory/75">
              {wedding.dateShort}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ivory/45">
              {wedding.venue.area}
            </p>
          </div>
          <span className="h-px w-8 bg-ivory/25" />
        </div>

        {/* hashtag */}
        <p className="mt-9 font-serif text-2xl italic text-ivory/80">
          #HandyAndSharon
        </p>

        {/* socials */}
        <div className="mt-6 flex items-center gap-8">
          {[
            { label: wedding.groom.name, handle: wedding.groom.instagram },
            { label: wedding.bride.name, handle: wedding.bride.instagram },
          ].map((s) => (
            <a
              key={s.handle}
              href={`https://instagram.com/${s.handle}`}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-1"
            >
              <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/40">
                {s.label}
              </span>
              <span className="relative text-[11px] uppercase tracking-[0.2em] text-ivory/80">
                @{s.handle}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ivory/60 transition-transform duration-500 ease-editorial group-hover:scale-x-100" />
              </span>
            </a>
          ))}
        </div>

        {/* back to top */}
        <button
          onClick={toTop}
          className="group mt-12 flex flex-col items-center gap-2"
          aria-label="Back to top"
        >
          <motion.span
            className="text-ivory/60"
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
          <span className="text-[9px] uppercase tracking-[0.32em] text-ivory/45 transition-colors duration-300 group-hover:text-ivory/80">
            Back to Top
          </span>
        </button>

        {/* credit */}
        <div className="mt-12 flex w-full flex-col items-center gap-3">
          <span className="h-px w-full max-w-xs bg-ivory/12" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">
            An Invitation Crafted with Love
          </p>
          <p className="text-[10px] uppercase tracking-[0.26em] text-ivory/30">
            © {wedding.year} · {wedding.groom.name} &amp; {wedding.bride.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
