"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { isPlaying, subscribe, toggle } from "@/lib/music";

const ease = [0.22, 1, 0.36, 1] as const;

/** Bar heights, in the order they stand. Uneven on purpose — even bars read as
 *  a loading spinner rather than as sound. */
const BARS = [
  { rest: 5, peak: 14, d: 0.72 },
  { rest: 9, peak: 18, d: 0.54 },
  { rest: 6, peak: 16, d: 0.63 },
  { rest: 10, peak: 13, d: 0.85 },
];

export default function MusicToggle() {
  // The element lives outside React (see lib/music.ts), so this reads from it
  // rather than mirroring it in state. The server snapshot is `false`: there is
  // no audio during SSR, and claiming otherwise would flash the wrong icon.
  const playing = useSyncExternalStore(subscribe, isPlaying, () => false);

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Turn the music off" : "Turn the music on"}
      aria-pressed={playing}
      title={playing ? "Turn the music off" : "Turn the music on"}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease, delay: 1.2 }}
      whileTap={{ scale: 0.93 }}
      /* Above the lightbox (z-60), deliberately: whatever a guest is looking
         at, silencing the page has to stay one tap away. */
      className="group fixed bottom-5 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-ivory/40 bg-ink/30 backdrop-blur-[3px] transition-colors duration-500 hover:bg-ink/50 sm:bottom-7 sm:right-7 sm:h-14 sm:w-14"
    >
      {/* breathing rose glow, only while it is actually making sound */}
      {playing && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-10 rounded-full blur-lg"
          style={{
            background:
              "radial-gradient(circle at center, rgba(201,120,154,0.35), transparent 70%)",
          }}
          animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.92, 1.06, 0.92] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <span className="flex items-end gap-[3px]" aria-hidden>
        {BARS.map((b, i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-ivory"
            initial={false}
            animate={
              playing
                ? { height: [b.rest, b.peak, b.rest], opacity: 1 }
                : { height: 3, opacity: 0.5 }
            }
            transition={
              playing
                ? { duration: b.d, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.35, ease }
            }
          />
        ))}
      </span>

      {/* struck through when silent — the bars alone are too quiet a signal */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute h-px w-7 origin-center bg-ivory/70 sm:w-8"
        initial={false}
        animate={{ rotate: -45, scaleX: playing ? 0 : 1 }}
        transition={{ duration: 0.35, ease }}
      />
    </motion.button>
  );
}
