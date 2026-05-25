"use client";

import { useEffect, useState } from "react";
import { getGuest, type Guest } from "@/lib/guests";

/**
 * Reads ?to=<slug> from the URL on the client (no Suspense boundary needed).
 * Returns the "default" guest until hydration completes.
 */
export function useGuest(): Guest {
  const [guest, setGuest] = useState<Guest>(getGuest(null));

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("to");
    setGuest(getGuest(slug));
  }, []);

  return guest;
}