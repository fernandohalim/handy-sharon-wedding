"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function ParallaxImage({
  src,
  alt = "",
  className = "",
  speed = 10,
}: {
  src: string;
  alt?: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y }}
        className="absolute -top-[20%] left-0 h-[140%] w-full object-cover soft-tone"
      />
    </div>
  );
}
