"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ImageReveal({
  src,
  alt = "",
  className = "",
  speed = 9,
  delay = 0,
}: {
  src: string;
  alt?: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
        animate={{
          clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
        }}
        transition={{ duration: 2, ease, delay }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ y }}
          className="absolute -top-[20%] left-0 h-[140%] w-full object-cover grayscale"
        />
      </motion.div>
    </div>
  );
}
