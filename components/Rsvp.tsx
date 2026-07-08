"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGuest } from "@/hooks/useGuest";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { images } from "@/lib/images";
import { wedding } from "@/lib/config";
import MaskText from "@/components/ui/MaskText";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { FloralSprig, FloralBud } from "@/components/ui/Floral";
import { fetchRsvp, submitRsvp } from "@/lib/firestore";

const ease = [0.22, 1, 0.36, 1] as const;

type RsvpData = { attending: boolean; pax: number; at: number };

export default function Rsvp() {
  const { guest, status } = useGuest();
  const { value, save, loaded } = useLocalStorage<RsvpData | null>(
    `rsvp:${guest.slug}`,
    null,
  );

  const [attending, setAttending] = useState<boolean | null>(null);
  const [pax, setPax] = useState(1);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [editing, setEditing] = useState(false);

  // Cross-browser lock: look up an existing RSVP in Firestore. If one exists,
  // hydrate the confirmation view so the form can't be filled in again.
  useEffect(() => {
    if (guest.slug === "default") {
      setChecking(false);
      return;
    }
    setChecking(true);
    let active = true;
    fetchRsvp(guest.slug)
      .then((r) => {
        if (active && r) {
          save({ attending: r.attending, pax: r.headcount, at: Date.now() });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest.slug]);

  const startEditing = () => {
    if (!value) return;
    setAttending(value.attending);
    setPax(value.pax > 0 ? value.pax : 1);
    setError("");
    setEditing(true);
  };

  const handleSubmit = async () => {
    if (attending === null || sending) return;
    if (guest.slug === "default") {
      setError(
        "We couldn't identify your invitation. Please open the personal link we sent you.",
      );
      return;
    }
    setSending(true);
    setError("");
    try {
      await submitRsvp({
        slug: guest.slug,
        name: guest.name,
        attending,
        headcount: attending ? pax : 0,
        message: "",
      });
      // localStorage = this browser's "already responded" flag (drives the
      // confirmation UI). The Firestore write above is the real record.
      save({ attending, pax: attending ? pax : 0, at: Date.now() });
      setEditing(false);
    } catch {
      setError("Something went wrong sending your response. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-5xl">
        {/* header */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <FloralSprig className="text-taupe" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-stone">
              Kindly Respond
            </span>
            <FloralSprig flip className="text-taupe" />
          </motion.div>
          <MaskText
            as="h2"
            text="Will You Celebrate With Us"
            className="mt-5 font-serif text-4xl font-light leading-[1.08] text-ink sm:text-6xl"
          />
        </div>

        {/* card */}
        <Reveal className="mt-14">
          <div className="grid overflow-hidden border border-line bg-paper lg:grid-cols-[0.82fr_1fr]">
            {/* image side */}
            <div className="relative h-56 lg:h-auto">
              <img
                src={images.gallery[5]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover soft-tone"
              />
              <div className="absolute inset-0 bg-ink/25" />
              <div className="pointer-events-none absolute inset-4 border border-ivory/30" />
              <div className="absolute bottom-6 left-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/75">
                  Handy &amp; Sharon
                </p>
                <p className="mt-1 font-serif text-2xl italic text-ivory">
                  {wedding.dateShort}
                </p>
              </div>
            </div>

            {/* form / confirmation side */}
            <div className="p-8 sm:p-11">
              <AnimatePresence mode="wait">
                {status === "loading" || !loaded || checking ? (
                  <motion.div key="load" className="h-72" />
                ) : guest.slug === "default" ? (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease }}
                    className="flex flex-col"
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
                      An Invitation Awaits
                    </h3>
                    <FloralBud className="mt-4 block text-taupe/80" />
                    <p className="mt-5 text-sm leading-relaxed text-stone">
                      This RSVP is reserved for our invited guests. Kindly open
                      the personal invitation link we sent you to confirm your
                      attendance.
                    </p>
                    <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-stone/70">
                      One invitation, one RSVP
                    </p>
                  </motion.div>
                ) : value && !editing ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease }}
                    className="flex flex-col"
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
                    <FloralBud className="mt-4 block text-taupe/80" />
                    <p className="mt-5 text-sm leading-relaxed text-stone">
                      {value.attending
                        ? "We are overjoyed that you'll be celebrating with us. Your presence will make our day complete."
                        : "We'll miss you dearly, but we're grateful you let us know. You'll be in our hearts on the day."}
                    </p>
                    {value.attending && (
                      <div className="mt-6 flex items-center gap-3 border border-line bg-ivory px-5 py-4">
                        <span className="font-serif text-3xl font-light text-taupe">
                          {value.pax}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.22em] text-stone">
                          {value.pax > 1 ? "Guests" : "Guest"} Confirmed
                        </span>
                      </div>
                    )}
                    <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-stone/70">
                      Your response has been recorded
                    </p>
                    <button
                      type="button"
                      onClick={startEditing}
                      className="mt-5 self-start text-[11px] uppercase tracking-[0.22em] text-stone underline decoration-stone/40 underline-offset-4 transition-colors duration-300 hover:text-ink"
                    >
                      Changed your mind? Edit response
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col"
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-stone">
                      Dear
                    </p>
                    <p className="mt-1 font-serif text-3xl italic text-ink sm:text-4xl">
                      {guest.name}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-stone">
                      We would be honored by your presence. Kindly let us know
                      if you&apos;ll be joining the celebration.
                    </p>

                    {/* attendance */}
                    <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        {
                          v: true,
                          t: "Joyfully Accepts",
                          s: "I will be there",
                        },
                        {
                          v: false,
                          t: "Regretfully Declines",
                          s: "I cannot attend",
                        },
                      ].map((o) => {
                        const sel = attending === o.v;
                        return (
                          <button
                            key={String(o.v)}
                            type="button"
                            onClick={() => setAttending(o.v)}
                            className={`flex flex-col items-start gap-1 border px-5 py-4 text-left transition-colors duration-300 ${
                              sel
                                ? "border-ink bg-ink text-ivory"
                                : "border-line text-ink hover:border-ink/40"
                            }`}
                          >
                            <span className="text-[12px] font-medium uppercase tracking-[0.16em]">
                              {o.t}
                            </span>
                            <span
                              className={`text-[11px] ${
                                sel ? "text-ivory/55" : "text-stone"
                              }`}
                            >
                              {o.s}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* party size */}
                    <AnimatePresence>
                      {attending === true && guest.pax > 1 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease }}
                          className="overflow-hidden"
                        >
                          <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-stone">
                            Number of Guests
                          </p>
                          <div className="mt-3 flex gap-3">
                            {Array.from(
                              { length: guest.pax },
                              (_, i) => i + 1,
                            ).map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setPax(n)}
                                className={`h-12 w-12 border font-serif text-xl transition-colors duration-300 ${
                                  pax === n
                                    ? "border-ink bg-ink text-ivory"
                                    : "border-line text-ink hover:border-ink/40"
                                }`}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* submit */}
                    <div className="mt-8">
                      <Button
                        onClick={handleSubmit}
                        className={`w-full ${
                          attending === null || sending
                            ? "pointer-events-none opacity-40"
                            : ""
                        }`}
                      >
                        {sending
                          ? "Sending…"
                          : editing
                            ? "Update Response"
                            : "Send Response"}
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

                    <p className="mt-5 text-center text-[10px] uppercase tracking-[0.26em] text-stone/70">
                      Kindly respond before the 1st of November, 2026
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
