"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { coverVideo } from "@/lib/images";
import Cover from "@/components/Cover";
import Hero from "@/components/Hero";
import Couple from "@/components/Couple";
import Story from "@/components/Story";
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

      {/* Cinematic film — fixed BEHIND the page. The sections below are
          transparent, so the footage reads clearly as a dark, moody backdrop;
          content sits on opaque light cards / in light text over the film.

          The container mounts immediately but the video only once the cover is
          opened: the sections underneath need the dark ground to be readable
          from the start, and the footage is far too heavy to pull down for a
          visitor who is still looking at the cover. */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
        {opened && (
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
        )}

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

      {/* The invitation is always in the DOM. Gating it behind `opened` meant a
          crawler — which renders the page but never clicks the cover — saw a
          document containing two names and nothing else: no date, no venue, no
          schema-bearing copy. `inert` keeps it out of the tab order and off
          screen readers while the cover is up without hiding it from indexers,
          which read the rendered markup.

          The `key` flips on open so React remounts the whole tree: every
          section's entrance animation is a mount-time `initial → animate`, and
          without the remount they would all have played out behind the cover
          while the guest was still deciding to tap. */}
      <div
        key={opened ? "invitation-open" : "invitation-idle"}
        inert={!opened}
      >
        <Hero />
        <Couple />
        <Story />
        <CountdownBand />
        <EventDetails />
        <Gallery />
        <Rsvp />
        <Gift />
        <Wishes active={opened} />
        <Footer />
      </div>
    </main>
  );
}
