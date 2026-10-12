// Central church details. Update here and the whole site follows.

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""; // e.g. 260971234567 (no +)

export const site = {
  name: "Living Temples Church",
  shortName: "LIT Church",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  mission: "Beautifying Every Life and Destiny by the Manifestation of the Truth.",
  themeVerse: {
    ref: "1 Corinthians 6:19",
    summary: "Your body is a temple of the Holy Spirit.",
  },
  tagline: "Come as you are",
  city: "Kitwe, Zambia",
  service: {
    day: "Sunday",
    time: "8:00 AM",
    // Used for "This Sunday", countdowns, calendar invites and check-in (Zambia time, UTC+2)
    weekday: 0, // 0 = Sunday
    startHour: 8,
    startMinute: 0,
    durationMinutes: 150,
    venue: "Havemore Restaurant",
    address: "20 Mpenzeni Avenue, Parklands, Kitwe",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Havemore+Restaurant+20+Mpenzeni+Avenue+Parklands+Kitwe",
    mapEmbed:
      "https://www.google.com/maps?q=Havemore+Restaurant,+Mpenzeni+Avenue,+Parklands,+Kitwe&output=embed",
  },
  leadPastor: "Reverend Mwamba",
  cellGroups: [
    { area: "Chimwemwe", leader: "To be announced" },
    { area: "Riverside", leader: "To be announced" },
    { area: "Ndeke", leader: "To be announced" },
    { area: "Buchi", leader: "To be announced" },
  ],
  whatsapp: {
    number: whatsappNumber,
    communityUrl: process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ?? "",
  },
} as const;

/** Click-to-chat link with a prefilled message. Falls back to the community link, then the visit page. */
export function whatsappLink(message: string) {
  if (site.whatsapp.number) {
    return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
  }
  return site.whatsapp.communityUrl || "/visit";
}

/** Share-to-WhatsApp link (opens the user's contact picker). */
export function whatsappShare(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
