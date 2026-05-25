"use client";

import { motion } from "motion/react";
import { wedding } from "@/lib/config";
import { images } from "@/lib/images";
import type { Guest } from "@/lib/guests";
import InviteButton from "@/components/ui/InviteButton";

const ease = [0.22, 1, 0.36, 1] as const;

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

/* Editorial corner brackets for the inset frame */
function Corners() {
  const c = "absolute h-4 w-4 border-ivory/55";
  return (
    <>
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </>
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
      className="fixed inset-0 z-50 overflow-hidden bg-ink text-ivory"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 1.1, ease }}
    >
      {/* ---- Background photo ---- */}
      <div className="absolute inset-0">
        <img
          src={images.cover}
          alt=""
          className="h-full w-full object-cover grayscale animate-kenburns"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/15 to-ink/90" />
        <div
          className="absolute inset-0"
          style={{ boxShadow: "inset 0 0 240px rgba(0,0,0,0.78)" }}
        />
      </div>

      {/* ---- Cinematic fade-in from black ---- */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-ink"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease }}
      />

      {/* ---- Ornamental frame ---- */}
      <motion.div
        className="pointer-events-none absolute inset-5 border border-ivory/25 sm:inset-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease, delay: 0.4 }}
      >
        <Corners />
      </motion.div>

      {/* ---- Content ---- */}
      <div className="relative flex h-full flex-col items-center justify-between px-7 py-16 text-center sm:py-20">
        {/* Top */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.55 }}
        >
          <span className="h-px w-8 bg-ivory/45" />
          <p className="text-[10px] uppercase tracking-[0.42em] text-ivory/80 sm:text-[11px]">
            Together With Their Families
          </p>
          <span className="h-px w-8 bg-ivory/45" />
        </motion.div>

        {/* Center — names */}
        <div className="flex flex-col items-center [text-shadow:0_2px_34px_rgba(0,0,0,0.6)]">
          <motion.p
            className="mb-3 text-[11px] uppercase tracking-[0.5em] text-ivory/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
          >
            The Wedding Of
          </motion.p>

          <h1 className="font-serif font-light leading-[0.86] text-ivory">
            <Rise delay={0.9} className="text-[clamp(3.8rem,18vw,10rem)]">
              {wedding.groom.name}
            </Rise>
            <motion.span
              className="my-1 block font-serif text-3xl italic text-taupe sm:my-2 sm:text-4xl"
              initial={{ opacity: 0, scale: 0.4, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease, delay: 1.1 }}
            >
              &
            </motion.span>
            <Rise delay={1.05} className="text-[clamp(3.8rem,18vw,10rem)]">
              {wedding.bride.name}
            </Rise>
          </h1>

          <motion.div
            className="mt-7 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            <motion.span
              className="h-px bg-ivory/45"
              initial={{ width: 0 }}
              animate={{ width: 36 }}
              transition={{ duration: 0.9, ease, delay: 1.35 }}
            />
            <span className="text-[11px] uppercase tracking-[0.34em] text-ivory/85">
              {wedding.dateShort}
            </span>
            <motion.span
              className="h-px bg-ivory/45"
              initial={{ width: 0 }}
              animate={{ width: 36 }}
              transition={{ duration: 0.9, ease, delay: 1.35 }}
            />
          </motion.div>

          <motion.p
            className="mt-2 text-[10px] uppercase tracking-[0.4em] text-ivory/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {wedding.venue.area}
          </motion.p>
        </div>

        {/* Bottom — guest + button */}
        <motion.div
          className="flex flex-col items-center gap-7"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.6 }}
        >
          <div className="flex flex-col items-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/55">
              This Invitation Is Prepared For
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="h-px w-5 bg-ivory/40" />
              <p className="font-serif text-2xl italic text-ivory sm:text-3xl">
                {guest.name}
              </p>
              <span className="h-px w-5 bg-ivory/40" />
            </div>
            <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-ivory/65 sm:text-sm">
              We joyfully invite you to share in our celebration of love.
            </p>
          </div>

          <InviteButton onClick={onOpen} />
        </motion.div>
      </div>
    </motion.div>
  );
}
