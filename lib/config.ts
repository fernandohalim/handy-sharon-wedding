export const wedding = {
  groom: {
    name: "Handy",
    fullName: "Handy Setiawan", // ASSUMED surname
    parents: "The son of Mr. & Mrs. Setiawan", // ASSUMED
    instagram: "handy",
  },
  bride: {
    name: "Sharon",
    fullName: "Andre Laurent", // ASSUMED surname
    parents: "The daughter of Mr. & Mrs. Setiawan", // ASSUMED
    instagram: "sharon",
  },

  // Bali time = WITA (UTC+8). 12.12.2026 is a Saturday.
  dateISO: "2026-12-12T16:00:00+08:00",
  dateShort: "12 · 12 · 2026",
  dateLong: "Saturday, the Twelfth of December, 2026",
  year: "2026",

  ceremony: { name: "Holy Matrimony", time: "16:00 WITA" }, // ASSUMED time
  reception: { name: "Wedding Reception", time: "18:30 WITA" }, // ASSUMED time

  venue: {
    name: "Sunset Cliff Estate", // ASSUMED — venue name still unknown
    area: "Uluwatu, Bali",
    address: "Jl. Pantai Suluban, Uluwatu, Badung Regency, Bali 80361", // ASSUMED
    mapsUrl: "https://maps.google.com/?q=Uluwatu+Bali", // ASSUMED
  },

  gift: {
    bank: "BCA",
    accountNumber: "1234567890", // ASSUMED — replace with real BCA number
    accountName: "Fernando Halim", // ASSUMED
  },
};