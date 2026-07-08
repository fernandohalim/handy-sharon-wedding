"use client";

import { useEffect, useState } from "react";
import { DEFAULT_GUEST, type Guest } from "@/lib/guests";
import { fetchGuest } from "@/lib/firestore";

export type GuestStatus = "loading" | "ready";

/**
 * Reads ?to=<slug> from the URL and resolves the guest from Firestore.
 *
 * Returns the resolved guest plus a `status`:
 *  - "loading" until a present slug has been looked up (avoids flashing the
 *    "invited guests only" state at a real guest while their lookup runs)
 *  - "ready"   once settled, or immediately when no slug is present
 *
 * A guest with slug "default" means the visitor arrived without a valid
 * personal link — writing (RSVP / wishes) should be disabled for them.
 */
export function useGuest(): { guest: Guest; status: GuestStatus } {
  const [guest, setGuest] = useState<Guest>(DEFAULT_GUEST);
  const [status, setStatus] = useState<GuestStatus>("loading");

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("to");
    if (!slug) {
      setStatus("ready");
      return;
    }

    let active = true;
    fetchGuest(slug.trim().toLowerCase())
      .then((g) => {
        if (active && g) setGuest(g);
      })
      .catch(() => {
        /* keep DEFAULT_GUEST on any error */
      })
      .finally(() => {
        if (active) setStatus("ready");
      });
    return () => {
      active = false;
    };
  }, []);

  return { guest, status };
}

/** True once resolution has settled and the visitor holds a valid invite. */
export function canWrite(guest: Guest, status: GuestStatus): boolean {
  return status === "ready" && guest.slug !== "default";
}
