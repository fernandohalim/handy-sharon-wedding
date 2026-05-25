"use client";

import { motion } from "motion/react";

export default function Marquee({
  items,
  tone = "light",
  speed = 34,
  reverse = false,
}: {
  items: string[];
  tone?: "light" | "dark";
  speed?: number;
  reverse?: boolean;
}) {
  const isDark = tone === "dark";

  const Row = () => (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`font-serif text-2xl italic sm:text-4xl ${
              isDark ? "text-ivory" : "text-ink"
            }`}
          >
            {t}
          </span>
          <span className="mx-7 text-sm text-taupe sm:mx-11 sm:text-base">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`flex overflow-hidden border-y py-6 sm:py-8 ${
        isDark ? "border-ivory/15 bg-ink" : "border-ink/12 bg-ivory"
      }`}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <Row />
        <Row />
      </motion.div>
    </div>
  );
}
