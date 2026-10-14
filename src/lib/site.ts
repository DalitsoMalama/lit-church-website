// Church identity (fixed in code) and editable church details (changed in /admin → Details).
// Server code reads the live details with `getSite()` (src/lib/content.ts); client
// components read them with `useSite()` (src/components/SiteProvider.tsx).

// Public address of the site. Set NEXT_PUBLIC_SITE_URL once the domain is live; until then
// Vercel's production address is used automatically (Vercel exposes it to the build).
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")
).replace(/\/$/, "");

/** Fixed identity: changes here need a code change and redeploy. */
const identity = {
  name: "Living Temples Church",
  shortName: "LIT Church",
  url: siteUrl,
  themeVerse: { ref: "1 Corinthians 6:19", summary: "Your body is a temple of the Holy Spirit." },
  tagline: "Come as you are",
};

export type CellGroup = { area: string; leader: string; meetingTime: string };

/** Everything staff can edit from the admin side. */
export type ChurchSettings = {
  mission: string;
  city: string;
  leadPastor: string;
  service: {
    weekday: number; // 0 = Sunday … 6 = Saturday
    startHour: number; // Zambia time (UTC+2)
    startMinute: number;
    durationMinutes: number;
    venue: string;
    address: string;
  };
  whatsapp: { number: string; communityUrl: string }; // number in international format without "+"
  cellGroups: CellGroup[];
};

export const defaultSettings: ChurchSettings = {
  mission: "Beautifying Every Life and Destiny by the Manifestation of the Truth.",
  city: "Kitwe, Zambia",
  leadPastor: "Reverend Mwamba",
  service: {
    weekday: 0,
    startHour: 8,
    startMinute: 0,
    durationMinutes: 150,
    venue: "Havemore Restaurant",
    address: "20 Mpenzeni Avenue, Parklands, Kitwe",
  },
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    communityUrl: process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ?? "",
  },
  cellGroups: [
    { area: "Chimwemwe", leader: "To be announced", meetingTime: "" },
    { area: "Riverside", leader: "To be announced", meetingTime: "" },
    { area: "Ndeke", leader: "To be announced", meetingTime: "" },
    { area: "Buchi", leader: "To be announced", meetingTime: "" },
  ],
};

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const timeLabel = (h: number, m: number) =>
  `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;

/** Combines identity + editable settings into what pages use (with derived labels and map links). */
export function buildSite(s: ChurchSettings) {
  const place = `${s.service.venue}, ${s.service.address}`;
  return {
    ...identity,
    mission: s.mission,
    city: s.city,
    leadPastor: s.leadPastor,
    service: {
      ...s.service,
      day: DAY_NAMES[s.service.weekday] ?? "Sunday",
      time: timeLabel(s.service.startHour, s.service.startMinute),
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`,
      mapEmbed: `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`,
    },
    whatsapp: s.whatsapp,
    cellGroups: s.cellGroups,
  };
}

export type SiteInfo = ReturnType<typeof buildSite>;

/** Built-in defaults. Prefer getSite() (server) or useSite() (client) so admin edits show up. */
export const site = buildSite(defaultSettings);

/** Click-to-chat link with a prefilled message. Falls back to the community link, then the visit page. */
export function whatsappLink(s: Pick<SiteInfo, "whatsapp">, message: string) {
  if (s.whatsapp.number) return `https://wa.me/${s.whatsapp.number}?text=${encodeURIComponent(message)}`;
  return s.whatsapp.communityUrl || "/visit";
}

/** Share-to-WhatsApp link (opens the user's contact picker). */
export function whatsappShare(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
