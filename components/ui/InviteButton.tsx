"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const CORNERS = [
  { pos: "left-0 top-0 border-l border-t", x: -6, y: -6 },
  { pos: "right-0 top-0 border-r border-t", x: 6, y: -6 },
  { pos: "bottom-0 left-0 border-b border-l", x: -6, y: 6 },
  { pos: "bottom-0 right-0 border-b border-r", x: 6, y: 6 },
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
      className="group relative flex flex-col items-center gap-5"
    >
      {/* breathing glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(244,240,233,0.22), transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* plaque + corner brackets (lifts on hover) */}
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
            className={`absolute h-3.5 w-3.5 border-ivory/70 transition-colors duration-500 group-hover:border-ivory ${c.pos}`}
          />
        ))}

        {/* the plaque */}
        <span className="relative block overflow-hidden border border-ivory/40 bg-ink/30 px-9 py-5 backdrop-blur-[3px]">
          {/* ink fill — sweeps up on hover */}
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
              Open the Invitation
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
        <span className="h-px w-4 bg-ivory/30" />
        Tap to Begin
        <span className="h-px w-4 bg-ivory/30" />
      </motion.span>
    </motion.button>
  );
}
