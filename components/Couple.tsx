"use client";

import { motion } from "motion/react";
import { wedding } from "@/lib/config";
import { images } from "@/lib/images";
import Reveal from "@/components/ui/Reveal";
import MaskText from "@/components/ui/MaskText";
import ImageReveal from "@/components/ui/ImageReveal";
import { FloralSprig, FloralTwig, FloralBud } from "@/components/ui/Floral";

const ease = [0.22, 1, 0.36, 1] as const;

// Placeholder — replace with the couple's own words.
const SHARED_BIO =
  "Two people who found in each other a steady, easy kind of joy — his quiet warmth beside her bright and generous heart. After years of building a life side by side, they are ready to call it a marriage, and they would be honoured to have you there when they do.";

function Named({
  label,
  fullName,
  parents,
}: {
  label: string;
  fullName: string;
  parents: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <FloralTwig className="text-taupe" />
        <span className="text-[11px] uppercase tracking-[0.35em] text-stone">
          {label}
        </span>
      </div>

      <MaskText
        as="h3"
        text={fullName}
        className="mt-3 font-serif text-3xl font-light leading-[1.05] text-ink sm:text-4xl"
      />

      <p className="mt-3 text-[11px] uppercase leading-relaxed tracking-[0.22em] text-stone">
        {parents}
      </p>
    </div>
  );
}

export default function Couple() {
  return (
    <section className="relative overflow-hidden bg-transparent px-6 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <div className="on-film flex flex-col items-center text-center">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <FloralSprig className="text-taupe" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-ivory/85">
              With Joyful Hearts
            </span>
            <FloralSprig flip className="text-taupe" />
          </motion.div>
          <MaskText
            as="h2"
            text="The Beloved Couple"
            className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ivory sm:text-6xl"
          />
          <motion.p
            className="mt-6 max-w-md text-sm leading-relaxed text-ivory/85"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            Brought together by chance, bound together by love — the two people
            about to begin a lifetime as one.
          </motion.p>
        </div>

        {/* portrait + shared panel */}
        <div className="relative mt-20 sm:mt-28">
          {/* ghost ampersand */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 left-0 -z-10 font-serif text-[42vw] italic leading-[0.7] text-transparent [-webkit-text-stroke:1px_rgba(238,242,251,0.14)] lg:text-[22rem]"
          >
            &amp;
          </span>

          <div className="relative flex flex-col gap-8 lg:block">
            <ImageReveal
              src={images.couple}
              alt={`${wedding.groom.fullName} and ${wedding.bride.fullName}`}
              speed={9}
              className="aspect-[4/5] w-full lg:aspect-auto lg:h-[88vh] lg:w-[58%]"
            />

            <motion.div
              initial={{ opacity: 0, x: 44 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-110px" }}
              transition={{ duration: 1, ease, delay: 0.2 }}
              className="relative z-10 border border-line bg-ivory p-8 sm:p-11 lg:absolute lg:right-0 lg:top-1/2 lg:w-[46%] lg:-translate-y-1/2"
            >
              <Named
                label="The Groom"
                fullName={wedding.groom.fullName}
                parents={wedding.groom.parents}
              />

              {/* ampersand rule between the two */}
              <div className="my-7 flex items-center gap-4">
                <span className="h-px flex-1 bg-line" />
                <span className="font-serif text-3xl font-light italic text-taupe">
                  &amp;
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <Named
                label="The Bride"
                fullName={wedding.bride.fullName}
                parents={wedding.bride.parents}
              />

              <Reveal delay={0.15}>
                <FloralBud className="mt-8 block text-taupe/80" />
                <p className="mt-5 text-sm leading-relaxed text-stone">
                  {SHARED_BIO}
                </p>
              </Reveal>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
