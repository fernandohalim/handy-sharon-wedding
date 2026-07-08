"use client";

import Link from "next/link";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-6 text-ink">
      {/* texture — diagonal hatch */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 7px, rgba(51,64,92,0.04) 7px 8px)",
        }}
      />
      {/* texture — dot grid */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(51,64,92,0.05) 1px, transparent 1.4px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* center glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 48% at 50% 50%, rgba(201,120,154,0.16), transparent 72%)",
        }}
      />

      {/* ornamental frame */}
      <motion.div
        className="pointer-events-none absolute inset-5 border border-ink/12 sm:inset-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease, delay: 0.3 }}
      />

      {/* ghost 404 */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute font-serif italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(51,64,92,0.09)]"
        style={{ fontSize: "min(38vw, 22rem)" }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease, delay: 0.5 }}
      >
        <motion.span
          className="inline-block"
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          404
        </motion.span>
      </motion.span>

      {/* content */}
      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        {/* eyebrow */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.7 }}
        >
          <span className="h-px w-8 bg-ink/25" />
          <p className="text-[10px] uppercase tracking-[0.42em] text-stone sm:text-[11px]">
            Page Not Found
          </p>
          <span className="h-px w-8 bg-ink/25" />
        </motion.div>

        {/* heading */}
        <h1 className="mt-7 font-serif font-light leading-[0.96] text-ink">
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span
              className="block text-[clamp(2.6rem,8.5vw,5rem)]"
              initial={{ y: "118%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.15, ease, delay: 0.85 }}
            >
              This Page
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.16em]">
            <motion.span
              className="block text-[clamp(2.6rem,8.5vw,5rem)] italic text-taupe"
              initial={{ y: "118%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.15, ease, delay: 1.0 }}
            >
              Has Wandered Off
            </motion.span>
          </span>
        </h1>

        {/* ornament divider */}
        <motion.div
          className="mt-8 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease, delay: 1.25 }}
        >
          <motion.span
            className="h-px bg-ink/25"
            initial={{ width: 0 }}
            animate={{ width: 44 }}
            transition={{ duration: 0.9, ease, delay: 1.35 }}
          />
          <motion.span
            className="text-base text-taupe"
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            ✦
          </motion.span>
          <motion.span
            className="h-px bg-ink/25"
            initial={{ width: 0 }}
            animate={{ width: 44 }}
            transition={{ duration: 0.9, ease, delay: 1.35 }}
          />
        </motion.div>

        {/* message */}
        <motion.p
          className="mt-7 max-w-md text-sm leading-relaxed text-stone sm:text-[15px]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.45 }}
        >
          The link may have drifted, or this page was never written. The
          invitation, however, awaits — just a step away.
        </motion.p>

        {/* return button */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.65 }}
        >
          <Link
            href="/"
            className="group relative mt-10 inline-flex items-center justify-center overflow-hidden border border-ink px-9 py-4"
          >
            {/* ink fill — sweeps up on hover */}
            <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-editorial group-hover:translate-y-0" />

            {/* light sweep */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-ink/10 to-transparent"
              animate={{ x: ["0%", "560%"] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 3,
              }}
            />

            <span className="relative z-10 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.28em] text-ink transition-colors duration-500 group-hover:text-ivory">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              Return to the Invitation
            </span>
          </Link>
        </motion.div>
      </div>

      {/* cinematic fade-in */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-paper"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.3, ease }}
      />
    </main>
  );
}
