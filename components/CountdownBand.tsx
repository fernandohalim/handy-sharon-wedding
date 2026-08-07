"use client";

import { motion } from "motion/react";
import { wedding } from "@/lib/config";
import Countdown from "@/components/Countdown";
import { FloralDivider } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CountdownBand() {
  return (
    <section className="relative overflow-hidden bg-transparent px-6 py-28 text-center text-ivory sm:py-36">
      {/* texture — fine diagonal hatch */}
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
      {/* soft center glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 48% at 50% 44%, rgba(201,120,154,0.18), transparent 72%)",
        }}
      />
      <div className="pointer-events-none absolute inset-5 border border-ivory/12 sm:inset-8" />

      {/* Frosted panel — this whole section is light type with no card of its
          own, and the countdown digits need to stay crisp, so it gets a real
          surface rather than relying on the veil alone. */}
      <div className="relative mx-auto flex max-w-2xl flex-col items-center border border-ivory/15 bg-ink/65 px-6 py-14 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-12 sm:py-16">
        <motion.p
          className="eyebrow text-ivory/85"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Counting Down
        </motion.p>

        <motion.h2
          className="mt-5 font-serif text-4xl font-light leading-tight sm:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
        >
          Until We Say{" "}
          <span className="italic text-taupe">&ldquo;I Do&rdquo;</span>
        </motion.h2>

        <FloralDivider className="mt-8 text-taupe/80" />

        <div className="mt-12">
          <Countdown tone="dark" />
        </div>

        <motion.p
          className="mt-12 text-[11px] uppercase tracking-[0.34em] text-ivory/85"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {wedding.dateLong}
        </motion.p>
      </div>
    </section>
  );
}
