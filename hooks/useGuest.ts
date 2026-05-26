"use client";

import { useEffect, useState } from "react";
import { DEFAULT_GUEST, type Guest } from "@/lib/guests";
import { fetchGuest } from "@/lib/firestore";

/**
 * Reads ?to=<slug> from the URL and resolves the guest from Firestore.
 * Returns DEFAULT_GUEST until the lookup resolves, or if the slug is
 * missing / unknown.
 */
export function useGuest(): Guest {
  const [guest, setGuest] = useState<Guest>(DEFAULT_GUEST);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("to");
    if (!slug) return;

    let active = true;
    fetchGuest(slug.trim().toLowerCase())
      .then((g) => {
        if (active && g) setGuest(g);
      })
      .catch(() => {
        /* keep DEFAULT_GUEST on any error */
      });
    return () => {
      active = false;
    };
  }, []);

  return guest;
}