"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { coverVideo } from "@/lib/images";
import { start as startMusic } from "@/lib/music";
import MusicToggle from "@/components/ui/MusicToggle";
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
          <Cover
            key="cover"
            guest={guest}
            /* startMusic() runs here, inside the tap itself, and not in an
               effect keyed off `opened` — browsers only grant permission to
               play sound to the gesture, and by the next render it is gone. */
            onOpen={() => {
              startMusic();
              setOpened(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Cinematic film — fixed BEHIND the page. The sections below are
          transparent, so the footage reads clearly as a dark, moody backdrop;
          content sits on opaque light cards / in light text over the film.

          The container mounts immediately but the video only once the cover is
          opened: the sections underneath need the dark ground to be readable
          from the start, and the footage is far too heavy to pull down for a
          visitor who is still looking at the cover. */}
      {/* `h-[100lvh]` on top of `inset-0`, and it is not redundant. iOS sizes a
          fixed element to the *small* viewport — the one with the toolbar in
          it. Scroll, the toolbar retracts, the visible page grows to the large
          viewport, and the film stays the size it was: a black band across the
          bottom of the screen where the footage has run out. `lvh` is that
          larger height, so the film covers every toolbar state. Anchored at
          top:0, so the overspill falls off the bottom where nothing reads it. */}
      <div className="pointer-events-none fixed inset-0 -z-10 h-[100lvh] overflow-hidden bg-black">
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
            film, raise it if type still fights bright frames.

            Neutral black, not `ink`: the navy tinted the whole film blue,
            which the couple did not want. Every other scrim laid over the
            film (Hero's bottom gradient, the Story strip's feathered
            edges) is neutral for the same reason — keep them in step. */}
        <div className="absolute inset-0 bg-black/60" />
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

      {/* Only once the invitation is open — there is nothing to toggle while
          the cover is up, and it would sit over the "Tap to Begin" cue. */}
      {opened && <MusicToggle />}
    </main>
  );
}
