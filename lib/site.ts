import { wedding } from "./config";

/**
 * Canonical origin for the deployed site.
 *
 * Everything that needs an absolute URL — the canonical link, Open Graph tags,
 * the sitemap, JSON-LD — resolves through here, so the domain lives in exactly
 * one place. Override it per-environment with NEXT_PUBLIC_SITE_URL; preview
 * deploys fall back to the URL Vercel assigns them so link previews still
 * resolve to something real before the domain is attached.
 */
const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "") ||
  "https://handpickedforshar.com";

export const siteUrl = configuredUrl.replace(/\/+$/, "");

const coupleNames = `${wedding.groom.name} & ${wedding.bride.name}`;
const fullNames = `${wedding.groom.fullName} & ${wedding.bride.fullName}`;

// Derived from the ISO date rather than the display strings, so re-wording
// `dateShort` or `dateLong` in the config can never silently break the title.
const [year, month, day] = wedding.dateISO.slice(0, 10).split("-");
const dateNumeric = `${day}.${month}.${year}`;

export const site = {
  url: siteUrl,
  /** Open Graph site name, and the suffix on every page title. */
  name: `${coupleNames} — The Wedding`,
  coupleNames,
  fullNames,
  dateNumeric,

  title: `${coupleNames} Wedding · ${dateNumeric} · Bali`,

  /**
   * Kept under ~160 characters so search engines show it whole, and front-loaded
   * with the names and date — the two things anyone searching for this site
   * would actually type.
   */
  description: `${fullNames} are getting married — ${dateNumeric} at ${wedding.venue.name}, ${wedding.venue.area}. RSVP here.`,

  keywords: [
    `${coupleNames} wedding`,
    wedding.groom.fullName,
    wedding.bride.fullName,
    wedding.hashtag.replace("#", ""),
    "wedding invitation",
    "Bali wedding",
    `wedding ${wedding.year}`,
    wedding.venue.name,
    "Denpasar wedding",
    "RSVP",
  ],

  locale: "en_US",
} as const;

/**
 * Schema.org Event markup. The vocabulary has no wedding-specific type, so
 * `Event` with a precise `location` is the correct modelling — it is what lets
 * the date and venue surface as a rich result.
 */
export function weddingJsonLd() {
  const dayPrefix = wedding.dateISO.slice(0, 11); // "2026-12-12T"
  const offset = wedding.dateISO.slice(-6); // "+08:00"

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `The Wedding of ${fullNames}`,
    description: site.description,
    startDate: wedding.dateISO,
    // Ceremony at 14:00, reception from 18:30 — closing out the evening.
    endDate: `${dayPrefix}22:00:00${offset}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: site.url,
    image: [`${site.url}/images/cover.webp`],
    location: {
      "@type": "Place",
      name: wedding.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Sunset, Pemogan, Denpasar Selatan",
        addressLocality: "Denpasar",
        addressRegion: "Bali",
        postalCode: "80361",
        addressCountry: "ID",
      },
      hasMap: wedding.venue.mapsUrl,
    },
    organizer: [
      { "@type": "Person", name: wedding.groom.fullName },
      { "@type": "Person", name: wedding.bride.fullName },
    ],
    subEvent: [
      {
        "@type": "Event",
        name: wedding.ceremony.name,
        startDate: wedding.dateISO,
        location: {
          "@type": "Place",
          name: `${wedding.ceremony.room}, ${wedding.venue.name}`,
          address: wedding.venue.address,
        },
      },
      {
        "@type": "Event",
        name: wedding.reception.name,
        startDate: `${dayPrefix}18:30:00${offset}`,
        location: {
          "@type": "Place",
          name: `${wedding.reception.room}, ${wedding.venue.name}`,
          address: wedding.venue.address,
        },
      },
    ],
  };
}
