export const wedding = {
  groom: {
    name: "Handy",
    fullName: "Handy Setiawan",
    parents: "The son of Mr. Welly Wijaya Liu & the late Mrs. Foenny Inahyani",
  },
  bride: {
    name: "Sharon",
    fullName: "Sharon Rebecca Joeniawan",
    parents:
      "The daughter of Mr. Tri Laksono Joeniawan & Mrs. Feibe Feronika Kalangi",
  },

  hashtag: "#HANDpickedforSHAR",

  // Bali time = WITA (UTC+8).
  dateISO: "2026-12-12T14:00:00+08:00",
  dateShort: "12 · 12 · 2026",
  dateLong: "Saturday, the Twelfth of December, 2026",
  year: "2026",

  ceremony: {
    name: "Holy Matrimony",
    time: "14:00 WITA",
    room: "Yudhistira Room",
  },
  reception: {
    name: "Wedding Reception",
    time: "18:30 WITA",
    room: "Kecak Ballroom",
  },

  venue: {
    name: "Harris Hotel & Residence Sunset Road",
    floor: "3rd Floor",
    area: "Denpasar, Bali",
    address:
      "Jl. Sunset, Pemogan, Denpasar Selatan, Kota Denpasar, Bali 80361, Indonesia",
    mapsUrl:
      "https://maps.google.com/?q=Harris+Hotel+%26+Residence+Sunset+Road+Denpasar+Bali",
  },

  // Multiple gift accounts (local + overseas).
  gifts: [
    {
      bank: "BCA",
      accountName: "Handy Setiawan",
      accountNumber: "6470498976",
    },
    {
      bank: "Commonwealth Bank",
      accountName: "Handy Setiawan",
      accountNumber: "12406116",
      bsb: "062028",
    },
  ] as Gift[],
};

export type Gift = {
  bank: string;
  accountName: string;
  accountNumber: string;
  bsb?: string;
};
