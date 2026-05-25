"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { ElementType } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function MaskText({
  text,
  className = "",
  delay = 0,
  stagger = 0.08,
  as: Tag = "div",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.16em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "120%" }}
            animate={inView ? { y: "0%" } : { y: "120%" }}
            transition={{ duration: 1, ease, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
