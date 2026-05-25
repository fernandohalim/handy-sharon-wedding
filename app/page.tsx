"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Cover from "@/components/Cover";
import Hero from "@/components/Hero";
import Couple from "@/components/Couple";
import OurStory from "@/components/OurStory";
import CountdownBand from "@/components/CountdownBand";
import EventDetails from "@/components/EventDetails";
import { useGuest } from "@/hooks/useGuest";

export default function Page() {
  const guest = useGuest();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    document.body.style.overflow = opened ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [opened]);

  return (
    <main className="bg-ivory">
      <AnimatePresence>
        {!opened && (
          <Cover key="cover" guest={guest} onOpen={() => setOpened(true)} />
        )}
      </AnimatePresence>

      {opened && (
        <>
          <Hero />
          <Couple />
          <OurStory />
          <CountdownBand />
          <EventDetails />
          {/* Phase 3 → Gallery, RSVP, Wishes, Gift, Footer */}
        </>
      )}
    </main>
  );
}
