"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function Perforations() {
  return (
    <div className="flex justify-between px-1">
      {Array.from({ length: 26 }).map((_, i) => (
        <span key={i} className="my-2 h-2 w-3 rounded-[2px] bg-ink/12" />
      ))}
    </div>
  );
}

export default function FilmStrip({
  images,
  pxPerSecond = 60,
}: {
  images: string[];
  pxPerSecond?: number;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(100);

  // Repeat the list so one group always exceeds the viewport width —
  // guarantees no empty gap appears at the loop seam.
  const frames = [...images, ...images, ...images];

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      if (w > 0) setDuration(w / pxPerSecond);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pxPerSecond]);

  const Group = ({ track }: { track?: boolean }) => (
    <div ref={track ? groupRef : undefined} className="flex shrink-0">
      {frames.map((src, i) => (
        <div
          key={i}
          className="mx-1.5 aspect-[3/4] w-36 shrink-0 overflow-hidden sm:w-52"
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover soft-tone"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-ivory py-1.5">
      <Perforations />
      <motion.div
        className="flex w-max py-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {/* two identical groups → translating exactly -50% loops seamlessly */}
        <Group track />
        <Group />
      </motion.div>
      <Perforations />
    </div>
  );
}
