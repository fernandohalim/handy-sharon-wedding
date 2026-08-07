"use client";

import { motion } from "motion/react";
import { FloralSprig } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

export default function SectionTitle({
  eyebrow,
  title,
  align = "center",
  tone = "light",
}: {
  eyebrow: string;
  title: React.ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  const floral = isDark ? "text-ivory/60" : "text-taupe";

  return (
    <div
      className={`flex flex-col ${
        align === "center"
          ? "items-center text-center"
          : "items-start text-left"
      }`}
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <FloralSprig className={floral} />
        <span
          className={`text-[11px] uppercase tracking-[0.4em] ${
            isDark ? "text-ivory/85" : "text-stone"
          }`}
        >
          {eyebrow}
        </span>
        {align === "center" && <FloralSprig flip className={floral} />}
      </motion.div>

      <motion.h2
        className={`mt-5 font-serif text-4xl font-light leading-[1.05] sm:text-6xl ${
          isDark ? "text-ivory" : "text-ink"
        }`}
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
      >
        {title}
      </motion.h2>
    </div>
  );
}
