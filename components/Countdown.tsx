"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { wedding } from "@/lib/config";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

type Left = { days: number; hours: number; minutes: number; seconds: number };

function getLeft(target: number): Left {
  const d = Math.max(0, target - Date.now());
  return {
    days: Math.floor(d / 86_400_000),
    hours: Math.floor((d / 3_600_000) % 24),
    minutes: Math.floor((d / 60_000) % 60),
    seconds: Math.floor((d / 1_000) % 60),
  };
}

export default function Countdown({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const target = new Date(wedding.dateISO).getTime();
  const [left, setLeft] = useState<Left | null>(null);

  useEffect(() => {
    setLeft(getLeft(target));
    const id = setInterval(() => setLeft(getLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const isDark = tone === "dark";
  const cell = isDark
    ? "border-ivory/20 bg-ivory/5"
    : "border-line bg-paper/70";
  const num = isDark ? "text-ivory" : "text-ink";
  const label = isDark ? "text-ivory/55" : "text-stone";
  const tick = isDark ? "bg-ivory/40" : "bg-ink/30";

  return (
    <div className={`flex gap-2.5 sm:gap-4 ${className}`}>
      {UNITS.map((u, i) => (
        <motion.div
          key={u.key}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`relative flex w-[72px] flex-col items-center gap-2.5 border px-2 py-5 backdrop-blur-sm sm:w-[112px] sm:py-7 ${cell}`}
        >
          <span
            className={`absolute -top-[5px] left-1/2 h-2.5 w-px -translate-x-1/2 ${tick}`}
          />
          <span
            className={`font-serif text-[2.7rem] font-light leading-none tabular-nums sm:text-6xl ${num}`}
          >
            {String(left ? left[u.key] : 0).padStart(2, "0")}
          </span>
          <span
            className={`text-[9px] uppercase tracking-[0.28em] sm:text-[10px] ${label}`}
          >
            {u.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
