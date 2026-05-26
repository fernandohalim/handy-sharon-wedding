"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGuest } from "@/hooks/useGuest";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { fetchWishes, submitWish, type Wish } from "@/lib/firestore";
import MaskText from "@/components/ui/MaskText";
import Button from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;
const MAX = 280;
const PAGE_SIZE = 3;

// localStorage record of the wish submitted from THIS browser
type MyWish = { name: string; message: string; at: number };

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
  const { value, save, loaded } = useLocalStorage<MyWish | null>(
    `wish:${guest.slug}`,
    null,
  );
  const [name, setName] = useState(guest.name);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loadingWishes, setLoadingWishes] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  // keep the name field in sync once the guest resolves from Firestore
  useEffect(() => setName(guest.name), [guest.name]);

  // load the public guestbook from Firestore on mount
  useEffect(() => {
    fetchWishes()
      .then(setWishes)
      .catch(() => {})
      .finally(() => setLoadingWishes(false));
  }, []);

  const myWish = wishes.find((w) => w.id === guest.slug);

  const startEditing = () => {
    if (myWish) {
      setName(myWish.name);
      setMessage(myWish.message);
    }
    setError("");
    setEditing(true);
  };

  const handleSubmit = async () => {
    const m = message.trim();
    if (m.length < 3 || !name.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      await submitWish(guest.slug, name.trim(), m);
      const updated: Wish = {
        id: guest.slug,
        name: name.trim(),
        message: m,
        createdAt: new Date(),
      };
      // replace this guest's existing wish, or add it at the top
      setWishes((w) => [updated, ...w.filter((x) => x.id !== guest.slug)]);
      save({ name: name.trim(), message: m, at: Date.now() });
      setEditing(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const alreadyWished = wishes.some((w) => w.id === guest.slug);

  const list: { wish: Wish; mine?: boolean }[] = wishes.map((w) => ({
    wish: w,
    mine: w.id === guest.slug,
  }));

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
                {!loaded || loadingWishes ? (
                  <motion.div key="l" className="h-64" />
                ) : (value || alreadyWished) && !editing ? (
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
                    <button
                      type="button"
                      onClick={startEditing}
                      className="mt-5 text-[11px] uppercase tracking-[0.22em] text-stone underline decoration-stone/40 underline-offset-4 transition-colors duration-300 hover:text-ink"
                    >
                      Edit your wish
                    </button>
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
                      Your Name
                    </p>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, 80))}
                      placeholder="Your name"
                      className="mt-2 w-full border-b border-line bg-transparent pb-2 font-serif text-3xl italic text-ink outline-none transition-colors duration-300 placeholder:text-stone/40 focus:border-ink/60 sm:text-4xl"
                    />

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
                          message.trim().length < 3 || !name.trim() || sending
                            ? "pointer-events-none opacity-40"
                            : ""
                        }`}
                      >
                        {sending
                          ? "Sending…"
                          : editing
                            ? "Update Your Blessing"
                            : "Send Your Blessing"}
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
                    {error && (
                      <p className="mt-4 text-center text-[12px] tracking-wide text-taupe">
                        {error}
                      </p>
                    )}
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
            {loadingWishes ? (
              <p className="py-10 text-center text-[10px] uppercase tracking-[0.3em] text-stone/70">
                Gathering wishes…
              </p>
            ) : list.length === 0 ? (
              <p className="py-10 text-center text-[10px] uppercase tracking-[0.3em] text-stone/70">
                No wishes yet — be the first to leave one.
              </p>
            ) : (
              <>
                {list.slice(0, visible).map((w, i) => (
                  <WishCard
                    key={w.wish.id}
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
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
