import { connection } from "next/server";
import { nextService } from "@/lib/service";
import { getSite } from "@/lib/content";

// "Add to calendar": an .ics invite for the next Sunday service (works with Google, Apple and Outlook calendars).
const ics = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1");

export async function GET() {
  await connection(); // depends on the current date
  const site = await getSite();
  const { start, end } = nextService(new Date(), site.service);
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Living Temples Church//Website//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:lit-sunday-${ics(start)}@litchurch`,
    `DTSTAMP:${ics(new Date())}`,
    `DTSTART:${ics(start)}`,
    `DTEND:${ics(end)}`,
    `SUMMARY:${esc(`${site.service.day} Service · ${site.name}`)}`,
    `LOCATION:${esc(`${site.service.venue}, ${site.service.address}`)}`,
    `DESCRIPTION:${esc(`Come as you are! Directions: ${site.service.mapUrl}`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Church starts in 1 hour",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="lit-church-sunday.ics"',
      "Cache-Control": "no-store",
    },
  });
}
