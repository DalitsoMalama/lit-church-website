import { DAY_NAMES, defaultSettings, type ChurchSettings } from "./site";

// Zambia (Africa/Lusaka) is UTC+2 all year, with no daylight saving.
const LUSAKA_OFFSET_MS = 2 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const TZ = "Africa/Lusaka";

export type ServiceTime = { start: Date; end: Date; live: boolean };
export type Schedule = Pick<ChurchSettings["service"], "weekday" | "startHour" | "startMinute" | "durationMinutes">;

/** The current service if it is under way, otherwise the next one. Safe on server and client. */
export function nextService(now: Date = new Date(), schedule: Schedule = defaultSettings.service): ServiceTime {
  const { weekday, startHour, startMinute, durationMinutes } = schedule;
  const local = new Date(now.getTime() + LUSAKA_OFFSET_MS); // UTC fields now read as Lusaka time
  const daysAhead = (7 + weekday - local.getUTCDay()) % 7;
  let start =
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + daysAhead, startHour, startMinute) -
    LUSAKA_OFFSET_MS;
  let end = start + durationMinutes * 60_000;
  if (now.getTime() >= end) {
    start += 7 * DAY_MS;
    end += 7 * DAY_MS;
  }
  return { start: new Date(start), end: new Date(end), live: now.getTime() >= start };
}

/** "Sun 18 Oct" (no comma, for signboards). */
export const formatServiceDate = (d: Date) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: TZ })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return `${p.weekday} ${p.day} ${p.month}`;
};

export const formatServiceDateLong = (d: Date) =>
  new Intl.DateTimeFormat("en-ZM", { weekday: "long", day: "numeric", month: "long", timeZone: TZ }).format(d);

/** YYYY-MM-DD in Zambia time. */
export const lusakaDate = (d: Date = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);

/** "Happening now" / "Today" / "Tomorrow" / "This Sunday" / "Next Sunday" label. */
export function serviceLabel(s: ServiceTime, now: Date = new Date(), weekday = defaultSettings.service.weekday) {
  const dayName = DAY_NAMES[weekday] ?? "Sunday";
  if (s.live) return "Happening now";
  const days = Math.round((Date.parse(lusakaDate(s.start)) - Date.parse(lusakaDate(now))) / DAY_MS);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days >= 7) return `Next ${dayName}`; // e.g. Sunday afternoon, after the service
  return `This ${dayName}`;
}
