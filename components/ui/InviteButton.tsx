"use client";

import { motion } from "motion/react";
import { SprigCorner, FloralTwig } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

const CORNERS = [
  { pos: "-left-1.5 -top-1.5", flip: "", x: -5, y: -5 },
  { pos: "-right-1.5 -top-1.5", flip: "-scale-x-100", x: 5, y: -5 },
  { pos: "-bottom-1.5 -left-1.5", flip: "-scale-y-100", x: -5, y: 5 },
  { pos: "-bottom-1.5 -right-1.5", flip: "-scale-100", x: 5, y: 5 },
] as const;

export default function InviteButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Open Invitation"
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, ease, delay: 1.75 }}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-col items-center gap-3.5 sm:gap-5"
    >
      {/* breathing rose glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(201,120,154,0.24), rgba(238,242,251,0.10), transparent 72%)",
        }}
        animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* plaque + floral corners (lifts on hover) */}
      <motion.span
        variants={{ hover: { y: -5 } }}
        transition={{ duration: 0.5, ease }}
        className="relative block"
      >
        {CORNERS.map((c, i) => (
          <motion.span
            key={i}
            aria-hidden
            variants={{ hover: { x: c.x, y: c.y } }}
            transition={{ duration: 0.5, ease }}
            className={`absolute z-10 ${c.pos}`}
          >
            <SprigCorner
              className={`text-ivory/75 transition-colors duration-500 group-hover:text-ivory ${c.flip}`}
            />
          </motion.span>
        ))}

        {/* the plaque */}
        <span className="relative block overflow-hidden border border-ivory/40 bg-ink/30 px-9 py-5 backdrop-blur-[3px]">
          {/* soft fill — sweeps up on hover */}
          <span className="absolute inset-0 translate-y-[101%] bg-ivory transition-transform duration-[550ms] ease-editorial group-hover:translate-y-0" />

          {/* light sweep */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-ivory/30 to-transparent"
            animate={{ x: ["0%", "560%"] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 3,
            }}
          />

          {/* inner hairline */}
          <span className="pointer-events-none absolute inset-[5px] border border-ivory/15 transition-colors duration-500 group-hover:border-ink/15" />

          {/* content */}
          <span className="relative z-10 flex items-center gap-4 text-ivory transition-colors duration-500 group-hover:text-ink">
            <motion.span
              className="text-sm text-taupe"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              ✦
            </motion.span>

            <span className="h-4 w-px bg-current opacity-30" />

            <span className="text-[11px] font-medium uppercase tracking-[0.34em]">
              Open Invitation
            </span>

            <span className="h-4 w-px bg-current opacity-30" />

            <motion.svg
              width="14"
              height="20"
              viewBox="0 0 14 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path d="M7 1v15M2 12l5 6 5-6" />
            </motion.svg>
          </span>
        </span>
      </motion.span>

      {/* caption */}
      <motion.span
        className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.42em] text-ivory/55"
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <FloralTwig className="text-ivory/45" />
        Tap to Begin
        <FloralTwig flip className="text-ivory/45" />
      </motion.span>
    </motion.button>
  );
}
