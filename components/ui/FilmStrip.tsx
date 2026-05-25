"use client";

import { motion } from "motion/react";

function Perforations() {
  return (
    <div className="flex justify-between px-1">
      {Array.from({ length: 26 }).map((_, i) => (
        <span key={i} className="my-2 h-2 w-3 rounded-[2px] bg-ivory/12" />
      ))}
    </div>
  );
}

export default function FilmStrip({
  images,
  speed = 46,
}: {
  images: string[];
  speed?: number;
}) {
  const Row = () => (
    <div className="flex shrink-0">
      {images.map((src, i) => (
        <div
          key={i}
          className="mx-1.5 aspect-[3/4] w-40 shrink-0 overflow-hidden sm:w-52"
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover grayscale"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-ink py-1.5">
      <Perforations />
      <motion.div
        className="flex py-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <Row />
        <Row />
      </motion.div>
      <Perforations />
    </div>
  );
}
