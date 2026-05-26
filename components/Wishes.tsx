"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGuest } from "@/hooks/useGuest";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import MaskText from "@/components/ui/MaskText";
import Button from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;
const MAX = 280;
const PAGE_SIZE = 3;

type Wish = { name: string; message: string; at: number };

// Placeholder wishes — replace with real ones if you'd like.
const SAMPLE_WISHES: Wish[] = [
  {
    name: "Grandma Mei",
    message:
      "May your home always be filled with laughter, patience, and endless love. So proud of the two of you.",
    at: 0,
  },
  {
    name: "David & Clara",
    message:
      "Wishing you a lifetime of adventures together. Cheers to the beautiful journey that lies ahead!",
    at: 0,
  },
  {
    name: "Auntie Rosa",
    message:
      "Two wonderful souls becoming one. May your marriage be blessed abundantly, today and all the days after.",
    at: 0,
  },
  {
    name: "The Tan Family",
    message:
      "From the bottom of our hearts — congratulations. May every day together be sweeter than the last.",
    at: 0,
  },
  {
    name: "Marcus",
    message:
      "So incredibly happy for you both. Here's to forever and always. Can't wait to celebrate with you!",
    at: 0,
  },
];

function WishCard({
  wish,
  mine,
  index,
}: {
  wish: Wish;
  mine?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease, delay: (index % 4) * 0.07 }}
      className={`mb-4 border p-6 sm:p-7 ${
        mine ? "border-ink bg-ink text-ivory" : "border-line bg-ivory"
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`font-serif text-4xl leading-[0.5] ${
            mine ? "text-ivory/35" : "text-taupe"
          }`}
        >
          &ldquo;
        </span>
        {mine && (
          <span className="text-[9px] uppercase tracking-[0.26em] text-ivory/45">
            Your Blessing
          </span>
        )}
      </div>
      <p
        className={`mt-2 font-serif text-lg italic leading-relaxed ${
          mine ? "text-ivory/90" : "text-ink"
        }`}
      >
        {wish.message}
      </p>
      <div className="mt-5 flex items-center gap-3">
        <span className={`h-px w-6 ${mine ? "bg-ivory/40" : "bg-ink/25"}`} />
        <span
          className={`text-[11px] uppercase tracking-[0.22em] ${
            mine ? "text-ivory/70" : "text-stone"
          }`}
        >
          {wish.name}
        </span>
      </div>
    </motion.div>
  );
}

export default function Wishes() {
  const guest = useGuest();
  const { value, save, loaded } = useLocalStorage<Wish | null>(
    `wish:${guest.slug}`,
    null,
  );
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const handleSubmit = () => {
    const m = message.trim();
    if (m.length < 3) return;
    save({ name: guest.name, message: m, at: Date.now() });
  };

  const list: { wish: Wish; mine?: boolean }[] = [
    ...(value ? [{ wish: value, mine: true }] : []),
    ...SAMPLE_WISHES.map((w) => ({ wish: w })),
  ];

  return (
    <section className="relative overflow-hidden bg-paper px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="h-px w-7 bg-ink/30" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-stone">
              Words of Love
            </span>
            <span className="h-px w-7 bg-ink/30" />
          </motion.div>
          <MaskText
            as="h2"
            text="Wishes & Prayers"
            className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ink sm:text-6xl"
          />
          <motion.p
            className="mt-6 max-w-md text-sm leading-relaxed text-stone"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            Leave a message, a prayer, or a blessing for the journey ahead —
            your words will mean the world to us.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* form */}
          <div>
            <div className="border border-line bg-ivory p-8 sm:p-10 lg:sticky lg:top-24">
              <AnimatePresence mode="wait">
                {!loaded ? (
                  <motion.div key="l" className="h-64" />
                ) : value ? (
                  <motion.div
                    key="d"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease }}
                  >
                    <motion.span
                      className="font-serif text-3xl text-taupe"
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, ease, delay: 0.15 }}
                    >
                      ✦
                    </motion.span>
                    <h3 className="mt-4 font-serif text-3xl font-light text-ink sm:text-4xl">
                      Thank You, {guest.name}
                    </h3>
                    <span className="mt-4 block h-px w-12 bg-ink/25" />
                    <p className="mt-5 text-sm leading-relaxed text-stone">
                      Your blessing has been added to our wall of love — you
                      will find it among the wishes. It means more to us than
                      words can say.
                    </p>
                    <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-stone/70">
                      One blessing per invitation
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="f"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-stone">
                      Writing As
                    </p>
                    <p className="mt-1 font-serif text-3xl italic text-ink sm:text-4xl">
                      {guest.name}
                    </p>

                    <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-stone">
                      Your Message
                    </p>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
                      rows={5}
                      placeholder="Write your wish or prayer for Handy & Sharon…"
                      className="mt-3 w-full resize-none border border-line bg-paper p-4 font-serif text-base italic leading-relaxed text-ink outline-none transition-colors duration-300 placeholder:not-italic placeholder:text-stone/50 focus:border-ink/60"
                    />
                    <p className="mt-2 text-right text-[10px] uppercase tracking-[0.2em] text-stone/60">
                      {message.length} / {MAX}
                    </p>

                    <div className="mt-5">
                      <Button
                        onClick={handleSubmit}
                        className={`w-full ${
                          message.trim().length < 3
                            ? "pointer-events-none opacity-40"
                            : ""
                        }`}
                      >
                        Send Your Blessing
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Button>
                    </div>
                    <p className="mt-4 text-center text-[10px] uppercase tracking-[0.26em] text-stone/70">
                      One blessing per invitation
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* wishes wall */}
          <div>
            {list.slice(0, visible).map((w, i) => (
              <WishCard
                key={`${w.wish.name}-${i}`}
                wish={w.wish}
                mine={w.mine}
                index={i}
              />
            ))}

            {visible < list.length ? (
              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-stone/70">
                  Showing {Math.min(visible, list.length)} of {list.length}{" "}
                  wishes
                </p>
                <Button onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Show More Wishes
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </Button>
              </div>
            ) : (
              list.length > PAGE_SIZE && (
                <p className="mt-7 text-center text-[10px] uppercase tracking-[0.3em] text-stone/60">
                  ✦ {list.length} wishes in total ✦
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
