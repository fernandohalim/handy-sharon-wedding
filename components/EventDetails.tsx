"use client";

import { wedding } from "@/lib/config";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { FloralBud } from "@/components/ui/Floral";

export default function EventDetails() {
  return (
    <section className="relative bg-transparent px-6 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          eyebrow="Save The Date"
          title="The Celebration"
          tone="dark"
        />

        {/* big date */}
        <Reveal className="on-film mt-16 flex flex-col items-center">
          <div className="flex items-center gap-5 sm:gap-9">
            <span className="text-right text-[11px] uppercase tracking-[0.3em] text-ivory/85">
              Saturday
            </span>
            <span className="font-serif text-7xl font-light leading-none text-ivory sm:text-[10rem]">
              12
            </span>
            <span className="text-left">
              <span className="block font-serif text-2xl italic text-taupe sm:text-3xl">
                December
              </span>
              <span className="block text-[11px] uppercase tracking-[0.3em] text-ivory/85">
                2026
              </span>
            </span>
          </div>
        </Reveal>

        {/* venue + events */}
        <Reveal className="mt-16">
          <div className="overflow-hidden border border-line bg-paper">
            {/* venue — merged in above the two cards */}
            <div className="flex flex-col items-center gap-3 border-b border-line px-8 py-12 text-center">
              <p className="eyebrow">The Venue</p>
              <h3 className="font-serif text-3xl font-light leading-tight text-ink sm:text-4xl">
                {wedding.venue.name}
              </h3>
              <p className="text-[12px] uppercase tracking-[0.28em] text-taupe">
                {wedding.venue.floor} · {wedding.venue.area}
              </p>
              <p className="max-w-md text-sm leading-relaxed text-stone">
                {wedding.venue.address}
              </p>
              <div className="mt-3">
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
            </div>

            {/* two events */}
            <div className="grid gap-px bg-line sm:grid-cols-2">
              {[wedding.ceremony, wedding.reception].map((e, i) => (
                <div key={e.name} className="bg-paper">
                  <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
                    <span className="font-serif text-xl italic text-taupe">
                      {i === 0 ? "First" : "And Then"}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-ink sm:text-3xl">
                      {e.name}
                    </h3>
                    <FloralBud className="text-taupe/80" />
                    <p className="text-[13px] uppercase tracking-[0.28em] text-ink">
                      {e.room}
                    </p>
                    <p className="text-[13px] uppercase tracking-[0.25em] text-stone">
                      {e.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
