// Validation for every public form. Kept outside the "use server" actions file so it
// can be unit-tested and so nothing here becomes a callable server action.
import { z } from "zod";

/** Store every number the same way (+260…) so one person is never counted twice. */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+") || digits.startsWith("260")) return `+${digits}`;
  if (digits.length === 10 && digits.startsWith("0")) return `+260${digits.slice(1)}`; // 097 123 4567
  if (digits.length === 9) return `+260${digits}`; // 97 123 4567
  return `+${digits}`;
}

export const phone = z
  .string()
  .trim()
  .max(20, "Enter a valid phone number")
  .regex(/^[+\d\s()-]+$/, "Enter a valid phone number")
  .transform(normalizePhone)
  // E.164: country code + number is 9–15 digits (Zambian mobiles: +260 9X XXX XXXX)
  .refine((p) => /^\+\d{9,15}$/.test(p), "Enter a valid phone number");

/** Free text: trims, collapses whitespace and strips control characters. */
const text = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max));

const name = text(100).pipe(z.string().min(2, "Please enter your name"));

const base = {
  name,
  phone,
  area: text(80).optional(),
  language: z.enum(["en", "bem"]).default("en"),
  consent: z.literal("on", { message: "Please give consent so we can contact you" }),
  // Evangelist referral code from QR cards; anything unexpected is simply dropped
  ref: z
    .string()
    .optional()
    .transform((r) => (r && /^[A-Za-z0-9_-]{1,20}$/.test(r) ? r : undefined)),
};

export const visitSchema = z.object({
  ...base,
  visitDate: z
    .string()
    .optional()
    .transform((d) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : undefined)),
  adults: z.coerce.number().int().min(1).max(20).default(1),
  kids: z.coerce.number().int().min(0).max(20).default(0),
  notes: text(500).optional(),
});

export const responseSchema = z.object({
  ...base,
  decision: z.enum(["gave_life_to_jesus", "rededicated", "wants_water_baptism", "wants_holy_spirit_prayer", "has_questions"]),
  notes: text(500).optional(),
});

export const prayerSchema = z.object({
  name: text(100).optional(),
  phone: z.literal("").transform(() => undefined).or(phone).optional(),
  category: z.enum(["salvation", "healing", "family", "work_finances", "deliverance", "holy_spirit", "other"]),
  request: text(1500).pipe(z.string().min(5, "Please share your prayer request")),
  visibility: z.enum(["team", "private"]).default("team"),
  consent: z.literal("on", { message: "Please give consent so we can follow up" }),
});

export const checkInSchema = z.object({
  name,
  phone,
  firstTime: z.enum(["yes", "no"], { message: "Is this your first time?" }),
  adults: z.coerce.number().int().min(1).max(20).default(1),
  children: z.coerce.number().int().min(0).max(20).default(0),
  area: text(80).optional(),
  heardFrom: z
    .enum(["street_outreach", "friend_family", "whatsapp", "social_media", "passing_by", "other"])
    .optional()
    .or(z.literal("").transform(() => undefined)),
  // Event name from a special-event QR code: letters, numbers, spaces and simple punctuation only
  service: z
    .string()
    .optional()
    .transform((s) => {
      const clean = s?.replace(/[^\p{L}\p{N} '&.,-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 60);
      return clean || undefined;
    }),
  consent: z.literal("on", { message: "Please give consent so we can record your attendance" }),
});

/** Copies string fields out of FormData, ignoring files and Next.js internals. */
export function formFields(formData: FormData) {
  const data: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === "string" && !k.startsWith("$ACTION")) data[k] = v;
  }
  return data;
}

/* ── Admin: church details ─────────────────────────────────────────── */

const line = (max: number) => text(max);
const httpsUrl = z
  .string()
  .trim()
  .max(300)
  .refine((u) => u === "" || /^https:\/\/[^\s<>"]+$/.test(u), "Must be a full https:// link");

export const settingsSchema = z.object({
  mission: line(200).pipe(z.string().min(5, "Mission is required")),
  city: line(80).pipe(z.string().min(2)),
  leadPastor: line(80).pipe(z.string().min(2, "Lead pastor is required")),
  service: z.object({
    weekday: z.coerce.number().int().min(0).max(6),
    startHour: z.coerce.number().int().min(0).max(23),
    startMinute: z.coerce.number().int().min(0).max(59),
    durationMinutes: z.coerce.number().int().min(15).max(600),
    venue: line(100).pipe(z.string().min(2, "Venue is required")),
    address: line(200).pipe(z.string().min(5, "Address is required")),
  }),
  whatsapp: z.object({
    // International format without "+", e.g. 260971234567; empty = not set yet
    number: z
      .string()
      .trim()
      .transform((n) => n.replace(/\D/g, ""))
      .refine((n) => n === "" || /^\d{9,15}$/.test(n), "Enter the number like 260971234567"),
    communityUrl: httpsUrl.refine((u) => u === "" || u.startsWith("https://chat.whatsapp.com/"), "Must be a chat.whatsapp.com invite link"),
  }),
  cellGroups: z
    .array(
      z.object({
        area: line(60).pipe(z.string().min(2, "Area is required")),
        leader: line(80),
        meetingTime: line(80),
      }),
    )
    .max(40),
});

/* ── Admin: sermons ────────────────────────────────────────────────── */

export const sermonSchema = z.object({
  title: line(150).pipe(z.string().min(2, "Title is required")),
  series: line(100).optional(),
  speaker: line(100).pipe(z.string().min(2, "Speaker is required")),
  preachedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  scripture: line(100).optional(),
  summary: line(1000).optional(),
  videoUrl: httpsUrl.optional(),
  audioUrl: httpsUrl.optional(),
  published: z.literal("on").optional(),
});

/* ── Admin: devotional day ─────────────────────────────────────────── */

export const devotionalSchema = z.object({
  title: line(120).pipe(z.string().min(2, "Title is required")),
  scripture: line(60).pipe(z.string().min(3, "Scripture reference is required")),
  verseText: line(1000).optional(),
  reflection: line(4000).pipe(z.string().min(20, "Reflection must be at least 20 characters")),
  prayer: line(1000).optional(),
  declaration: line(500).optional(),
  action: line(500).optional(),
  approved: z.literal("on").optional(),
});

/* ── Admin: follow-up & prayer ─────────────────────────────────────── */

export const followupSchema = z.object({
  stage: z.enum(["new", "contacted", "visited", "attending", "foundations", "baptized", "cell_group", "closed"]),
  notes: line(2000).optional(),
  contactedNow: z.literal("on").optional(),
});

export const prayerUpdateSchema = z.object({
  status: z.enum(["open", "praying", "answered", "archived"]),
  testimony: line(1500).optional(),
});
