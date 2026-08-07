"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { coverVideo } from "@/lib/images";
import Cover from "@/components/Cover";
import Hero from "@/components/Hero";
import Couple from "@/components/Couple";
import CountdownBand from "@/components/CountdownBand";
import EventDetails from "@/components/EventDetails";
import { useGuest } from "@/hooks/useGuest";
import Gallery from "@/components/Gallery";
import Rsvp from "@/components/Rsvp";
import Wishes from "@/components/Wishes";
import Gift from "@/components/Gift";
import Footer from "@/components/Footer";

export default function Page() {
  const { guest } = useGuest();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    document.body.style.overflow = opened ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [opened]);

  return (
    <main className="bg-transparent">
      <AnimatePresence>
        {!opened && (
          <Cover key="cover" guest={guest} onOpen={() => setOpened(true)} />
        )}
      </AnimatePresence>

      {opened && (
        <>
          {/* Cinematic film — fixed BEHIND the page. The sections below are
              transparent, so the footage reads clearly as a dark, moody backdrop;
              content sits on opaque light cards / in light text over the film. */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
            <video
              className="h-full w-full object-cover"
              src={coverVideo.src}
              poster={coverVideo.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />

            {/* Single flat veil, evenly across the frame.
                Deliberately the only thing between the film and the type: any
                shaped overlay — a radial scrim, a blurred band — announces
                itself as a smudge once you notice its edge. A uniform veil
                never does. Light text carries an `on-film` shadow on top of
                this, which hugs the glyphs instead of laying down a shape.
                This value is the contrast knob: lower it for a more vivid
                film, raise it if type still fights bright frames. */}
            <div className="absolute inset-0 bg-ink/60" />
          </div>

          <Hero />
          <Couple />
          <CountdownBand />
          <EventDetails />
          <Gallery />
          <Rsvp />
          <Gift />
          <Wishes />
          <Footer />
        </>
      )}
    </main>
  );
}
