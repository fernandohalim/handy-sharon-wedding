export type Guest = {
  slug: string; // used in the link: ?to=<slug>
  name: string; // shown on the cover, RSVP, wishes
  pax: number; // max attendees this invitation may confirm (≤ 2)
};

/**
 * Each guest gets a unique link, e.g. https://yoursite.com/?to=john-doe
 * Add one entry per invitation. If ?to= is missing or unknown,
 * the "default" entry is used as a graceful fallback.
 */
export const guests: Guest[] = [
  { slug: "default", name: "Honored Guest", pax: 2 },
  { slug: "john-doe", name: "John Doe", pax: 2 },
  { slug: "amelia", name: "Amelia & Partner", pax: 2 },
  { slug: "uncle-rudy", name: "Uncle Rudy", pax: 1 },
];

export function getGuest(slug: string | null | undefined): Guest {
  if (!slug) return guests[0];
  const normalized = slug.trim().toLowerCase();
  return guests.find((g) => g.slug === normalized) ?? guests[0];
}