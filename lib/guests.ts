export type Guest = {
  slug: string;
  name: string;
  pax: number;
};

/**
 * Fallback used when ?to= is missing or the slug isn't found in Firestore.
 * The RSVP form is disabled for this guest — slug "default" has no matching
 * Firestore doc, so RSVP writes would be rejected by the security rules.
 */
export const DEFAULT_GUEST: Guest = {
  slug: "default",
  name: "Honored Guest",
  pax: 2,
};