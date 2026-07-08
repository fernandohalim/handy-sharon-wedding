"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { wedding } from "@/lib/config";
import MaskText from "@/components/ui/MaskText";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { FloralSprig } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Gift() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(wedding.gift.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  return (
    <section className="relative overflow-hidden bg-paper px-6 py-24 text-ink sm:px-10 sm:py-32">
      <div className="mx-auto max-w-3xl">
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
              With Gratitude
            </span>
            <FloralSprig flip className="text-taupe" />
          </motion.div>
          <MaskText
            as="h2"
            text="A Token of Love"
            className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ink sm:text-6xl"
          />
          <motion.p
            className="mt-6 max-w-lg text-sm leading-relaxed text-stone"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            Your presence and prayers are the greatest gift we could ask for.
            Yet should you wish to share a token of love, we have provided our
            details below with heartfelt gratitude.
          </motion.p>
        </div>

        {/* card */}
        <Reveal className="mt-14">
          <div className="relative mx-auto max-w-md overflow-hidden border border-line bg-gradient-to-br from-ivory to-paper p-9 shadow-[0_20px_60px_-30px_rgba(51,64,92,0.35)] sm:p-11">
            <motion.div
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{ x: ["0%", "440%"] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 4,
              }}
            />
            <div className="pointer-events-none absolute inset-3 border border-ink/10" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl tracking-[0.08em] text-ink">
                  {wedding.gift.bank}
                </span>
                <span className="text-sm text-taupe">✦</span>
              </div>

              <p className="mt-12 text-[10px] uppercase tracking-[0.34em] text-stone">
                Account Number
              </p>
              <p className="mt-2 font-serif text-3xl tracking-[0.14em] text-ink sm:text-4xl">
                {wedding.gift.accountNumber}
              </p>

              <div className="mt-9 border-t border-line pt-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone">
                  Account Holder
                </p>
                <p className="mt-1 font-serif text-xl italic text-ink">
                  {wedding.gift.accountName}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* copy */}
        <Reveal delay={0.1} className="mt-8 flex justify-center">
          <Button onClick={copy}>
            {copied ? "Number Copied" : "Copy Account Number"}
            {copied ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="9" y="9" width="11" height="11" rx="1" />
                <path d="M5 15V5a1 1 0 011-1h10" />
              </svg>
            )}
          </Button>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-sm text-center font-serif text-lg italic leading-relaxed text-stone">
            Thank you for your love, your presence, and your endless generosity.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
