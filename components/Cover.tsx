"use client";

import { motion } from "motion/react";
import { wedding } from "@/lib/config";
import { images } from "@/lib/images";
import type { Guest } from "@/lib/guests";
import InviteButton from "@/components/ui/InviteButton";
import { FloralSprig, FloralTwig } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * On a phone the photograph fills the screen. On a wide screen it cannot: it is
 * a 2:3 upright frame, and letting it cover a landscape viewport would crop away
 * both the water at the top and the steps at the bottom — the two empty areas
 * this whole layout is built on. So from `lg` it becomes a full-height upright
 * panel centred on the ink, like a poster on a wall, and the type travels with
 * it. Both rules resolve to the same width so the two stay in register — keep
 * the two expressions identical if you change one.
 */
const PANEL_W = "lg:w-[min(100vw,calc(100svh*0.6664))]";
const PANEL_POS = `lg:left-1/2 lg:right-auto lg:-translate-x-1/2 ${PANEL_W}`;

/* Masked reveal — text rises from behind a clip */
function Rise({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.14em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "118%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.15, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Cover({
  guest,
  onOpen,
}: {
  guest: Guest;
  onOpen: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-ink"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 1.1, ease }}
    >
      {/* ---- The photograph ----
          Nothing is laid over it: no veil, no vignette, and none of the
          `soft-tone` desaturation the in-page photos carry. That is the whole
          point of this layout — the type is placed where the picture already
          has room for it, instead of the picture being dimmed to make room.

          The crop keeps the full height (which is what preserves the water and
          the steps) and trims the width, positioned so the couple sits a little
          left of centre with the handrail leading in behind them. */}
      <div
        className={`absolute inset-0 ${PANEL_POS} lg:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)]`}
      >
        <img
          className="h-full w-full object-cover"
          style={{ objectPosition: "40% 50%" }}
          src={images.cover}
          alt={`${wedding.groom.fullName} and ${wedding.bride.fullName} on the harbour steps, from their prewedding shoot`}
          width={933}
          height={1400}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* ---- Cinematic fade-in from black ---- */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-ink"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease }}
      />

      {/* ---- Content ----
          Two blocks pinned to the ends, and deliberately nothing in the middle:
          the gap is where the couple is.

          Each block takes its colour from the photograph underneath rather than
          from a scrim laid on top. Measured off the actual file: the sunlit
          water in the top third averages L=215–236, where ink reads at 7–8.4:1
          and ivory would vanish at 1.0:1; the steps in the bottom quarter
          average L=74–92, where ivory reads at 5.7–7.6:1 and ink would vanish.
          So the top is set in ink and the bottom in ivory, and neither needs the
          photograph darkened. Keep type out of the 32–40% band — that is the
          crossover, and it is legible for neither. */}
      <div
        className={`relative mx-auto flex h-full flex-col justify-between px-7 py-10 text-center ${PANEL_W} sm:py-12 lg:pb-[3svh] lg:pt-[4svh]`}
      >
        {/* TOP — in ink, on the water */}
        <div className="flex flex-col items-center text-ink [text-shadow:0_1px_12px_rgba(253,245,248,0.75)]">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.55 }}
          >
            <FloralSprig className="text-ink/60" />
            <p className="text-[10px] uppercase tracking-[0.42em] text-ink/75 sm:text-[11px] lg:text-[clamp(9px,1.3svh,12px)]">
              Together With Their Families
            </p>
            <FloralSprig flip className="text-ink/60" />
          </motion.div>

          <motion.p
            className="mb-2 mt-5 text-[10px] uppercase tracking-[0.5em] text-ink/70 sm:text-[11px] lg:mb-[1svh] lg:mt-[2svh] lg:text-[clamp(9px,1.3svh,12px)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
          >
            The Wedding Of
          </motion.p>

          {/* Deliberately not an <h1>. The cover is an overlay that unmounts
              the moment it is opened; the document's single h1 lives in the
              Hero, which is always in the markup.

              Stacked rather than set on one line: at this size "Handy & Sharon"
              is wider than a phone, and stacking is what lets the names stay
              large enough to hold the top of the frame. */}
          <p className="font-serif font-light leading-[0.92] text-ink">
            <Rise delay={0.9} className="text-[clamp(2.2rem,11vw,4.5rem)] lg:text-[clamp(1.9rem,6svh,4rem)]">
              {wedding.groom.name}
            </Rise>
            <motion.span
              className="my-0.5 block font-serif text-2xl italic text-taupe sm:text-3xl lg:text-[clamp(14px,2.4svh,26px)]"
              initial={{ opacity: 0, scale: 0.4, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease, delay: 1.1 }}
            >
              &
            </motion.span>
            <Rise delay={1.05} className="text-[clamp(2.2rem,11vw,4.5rem)] lg:text-[clamp(1.9rem,6svh,4rem)]">
              {wedding.bride.name}
            </Rise>
          </p>

          <motion.p
            className="mt-3 text-[10px] uppercase tracking-[0.36em] text-ink/75 sm:text-[11px] lg:mt-[1.6svh] lg:text-[clamp(9px,1.3svh,12px)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            {wedding.dateShort}
          </motion.p>
        </div>

        {/* BOTTOM — in ivory, on the steps */}
        <motion.div
          className="on-film flex flex-col items-center text-ivory"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.5 }}
        >
          <p className="mb-5 font-serif text-base italic tracking-[0.12em] text-ivory/85 sm:text-lg lg:mb-[2.5svh] lg:text-[clamp(13px,2.2svh,20px)]">
            {wedding.hashtag}
          </p>

          <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/70 lg:text-[clamp(9px,1.25svh,11px)]">
            This Invitation Is Prepared For
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <FloralTwig className="text-ivory/70" />
            <p className="font-serif text-xl italic text-ivory sm:text-2xl lg:text-[clamp(16px,2.8svh,26px)]">
              {guest.name}
            </p>
            <FloralTwig flip className="text-ivory/70" />
          </div>

          <div className="mt-5 lg:mt-[2svh]">
            <InviteButton onClick={onOpen} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
