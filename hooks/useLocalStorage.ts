"use client";

import { useEffect, useState } from "react";

/**
 * Local state backed by localStorage under `key`.
 *
 * `loaded` is keyed, not a plain boolean, and that is load-bearing. `key` here
 * is `rsvp:${guest.slug}`, and the slug arrives asynchronously — so the key
 * changes mid-life, and for one render after it changes the state still holds
 * the *previous* key's value. Reporting `loaded: true` during that window let
 * the RSVP card render a blank form at a guest who had already replied, which
 * then jammed the card's exit animation. Comparing the loaded key against the
 * current one closes the window: `loaded` is false until the value in hand
 * actually belongs to the key being asked about.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      setValue(raw !== null ? (JSON.parse(raw) as T) : initial);
    } catch {
      setValue(initial);
    }
    setLoadedKey(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = (v: T) => {
    setValue(v);
    setLoadedKey(key);
    try {
      window.localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  };

  return { value, save, loaded: loadedKey === key };
}
