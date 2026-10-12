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
