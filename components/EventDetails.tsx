"use client";

import { wedding } from "@/lib/config";
import { images } from "@/lib/images";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

export default function EventDetails() {
  return (
    <section className="relative bg-ivory px-6 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionTitle eyebrow="Save The Date" title="The Celebration" />

        {/* big date */}
        <Reveal className="mt-16 flex flex-col items-center">
          <div className="flex items-center gap-5 sm:gap-9">
            <span className="text-right text-[11px] uppercase tracking-[0.3em] text-stone">
              Saturday
            </span>
            <span className="font-serif text-7xl font-light leading-none text-ink sm:text-[10rem]">
              12
            </span>
            <span className="text-left">
              <span className="block font-serif text-2xl italic text-taupe sm:text-3xl">
                December
              </span>
              <span className="block text-[11px] uppercase tracking-[0.3em] text-stone">
                2026
              </span>
            </span>
          </div>
        </Reveal>

        {/* two events */}
        <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {[wedding.ceremony, wedding.reception].map((e, i) => (
            <Reveal key={e.name} delay={i * 0.1} className="bg-paper">
              <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
                <span className="font-serif text-xl italic text-taupe">
                  {i === 0 ? "First" : "And Then"}
                </span>
                <h3 className="font-serif text-2xl font-light text-ink sm:text-3xl">
                  {e.name}
                </h3>
                <span className="h-px w-10 bg-ink/25" />
                <p className="text-[13px] uppercase tracking-[0.25em] text-stone">
                  {e.time}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* venue */}
        <div className="mt-16 flex flex-col gap-10 sm:flex-row sm:items-stretch sm:gap-14">
          <Reveal className="w-full sm:w-1/2">
            <div className="aspect-[4/3] w-full overflow-hidden sm:h-full">
              <img
                src={images.gallery[4]}
                alt={wedding.venue.name}
                loading="lazy"
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </Reveal>

          <div className="flex w-full flex-col justify-center sm:w-1/2">
            <Reveal delay={0.1}>
              <p className="eyebrow">The Venue</p>
              <h3 className="mt-3 font-serif text-3xl font-light leading-tight text-ink sm:text-4xl">
                {wedding.venue.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-stone">
                {wedding.venue.address}
              </p>
              <div className="mt-7">
                <Button href={wedding.venue.mapsUrl}>
                  Open In Maps
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M7 17L17 7M17 7H8M17 7v9" />
                  </svg>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
