"use server";

import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { lusakaDate } from "@/lib/service";
import { getSite } from "@/lib/content";
import { publicClient, supabaseConfigured } from "@/lib/supabase/server";
import { checkInSchema, formFields as fields, prayerSchema, responseSchema, visitSchema } from "@/lib/validation";

export type FormState = { ok: boolean; message: string; errors?: Record<string, string[]> };

const TEN_MINUTES = 10 * 60 * 1000;

/** Shared guard: spam honeypot, rate limit and missing backend. Returns an early state or null. */
async function preflight(
  data: Record<string, string>,
  scope: string,
  { limit = 20, offlineMessage = "Our online forms are not connected yet. Please reach us on WhatsApp or visit us on Sunday." } = {},
): Promise<FormState | null> {
  if (data.website) return { ok: true, message: "Thank you!" }; // honeypot filled → bot; pretend success
  if (!(await rateLimit(scope, limit, TEN_MINUTES))) {
    return { ok: false, message: "Too many submissions from this connection. Please wait a few minutes and try again." };
  }
  if (!supabaseConfigured) return { ok: false, message: offlineMessage };
  return null;
}

async function createPerson(
  p: { name: string; phone: string; area?: string; language: string; ref?: string },
  source: string,
  event: { type: string; payload: Record<string, unknown> },
) {
  const db = publicClient();
  const id = crypto.randomUUID(); // generated here because anon may insert but never read back
  const { error } = await db.from("people").insert({
    id,
    name: p.name,
    phone: p.phone,
    area: p.area || null,
    language: p.language,
    source,
    referral_code: p.ref || null,
    consent_at: new Date().toISOString(),
  });
  if (error) throw error;
  const { error: evError } = await db
    .from("journey_events")
    .insert({ person_id: id, type: event.type, payload: event.payload });
  if (evError) throw evError;
}

export async function submitVisit(_prev: FormState, formData: FormData): Promise<FormState> {
  const data = fields(formData);
  const early = await preflight(data, "visit");
  if (early) return early;

  const parsed = visitSchema.safeParse(data);
  if (!parsed.success) return { ok: false, message: "Please check the form.", errors: z.flattenError(parsed.error).fieldErrors };
  const v = parsed.data;

  try {
    await createPerson(v, "plan_a_visit", {
      type: "visit_planned",
      payload: { visit_date: v.visitDate, adults: v.adults, kids: v.kids, notes: v.notes },
    });
    return { ok: true, message: `Thank you, ${v.name}! We can't wait to welcome you. Someone from our team will message you.` };
  } catch (e) {
    console.error("submitVisit", e);
    return { ok: false, message: "Something went wrong. Please try again or reach us on WhatsApp." };
  }
}

export async function submitResponse(_prev: FormState, formData: FormData): Promise<FormState> {
  const data = fields(formData);
  const early = await preflight(data, "response");
  if (early) return early;

  const parsed = responseSchema.safeParse(data);
  if (!parsed.success) return { ok: false, message: "Please check the form.", errors: z.flattenError(parsed.error).fieldErrors };
  const r = parsed.data;

  try {
    await createPerson(r, "know_jesus", { type: r.decision, payload: { notes: r.notes } });
    return {
      ok: true,
      message:
        r.decision === "gave_life_to_jesus"
          ? `Welcome to the family of God, ${r.name}! Heaven is rejoicing (Luke 15:7). Someone from LIT will contact you within 24 hours.`
          : `Thank you, ${r.name}. Someone from LIT will contact you within 24 hours.`,
    };
  } catch (e) {
    console.error("submitResponse", e);
    return { ok: false, message: "Something went wrong. Please try again or reach us on WhatsApp." };
  }
}

export async function submitPrayer(_prev: FormState, formData: FormData): Promise<FormState> {
  const data = fields(formData);
  const early = await preflight(data, "prayer");
  if (early) return early;

  const parsed = prayerSchema.safeParse(data);
  if (!parsed.success) return { ok: false, message: "Please check the form.", errors: z.flattenError(parsed.error).fieldErrors };
  const p = parsed.data;

  try {
    const { error } = await publicClient().from("prayer_requests").insert({
      name: p.name || null,
      phone: p.phone || null,
      category: p.category,
      body: p.request,
      visibility: p.visibility,
      consent_at: new Date().toISOString(),
    });
    if (error) throw error;
    return { ok: true, message: "Your request has been received. Our prayer team is standing with you in faith." };
  } catch (e) {
    console.error("submitPrayer", e);
    return { ok: false, message: "Something went wrong. Please try again or reach us on WhatsApp." };
  }
}

export async function submitCheckIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const data = fields(formData);
  // High limit: a whole congregation may share the venue Wi-Fi (one IP address)
  const early = await preflight(data, "checkin", {
    limit: 300,
    offlineMessage: "Online check-in isn’t connected yet. Please give your name to an usher. Welcome!",
  });
  if (early) return early;

  const parsed = checkInSchema.safeParse(data);
  if (!parsed.success) return { ok: false, message: "Please check the form.", errors: z.flattenError(parsed.error).fieldErrors };
  const c = parsed.data;

  // On the regular service day it is always that service (e.g. "Sunday Service"); on other days a QR code can name the event (?service=Youth Night)
  const now = new Date();
  const site = await getSite();
  const isServiceDay = new Date(now.getTime() + 2 * 3600_000).getUTCDay() === site.service.weekday;
  const service = isServiceDay ? `${site.service.day} Service` : c.service || "Special Service";

  try {
    const { error } = await publicClient().from("attendance").insert({
      service_date: lusakaDate(now),
      service,
      name: c.name,
      phone: c.phone,
      first_time: c.firstTime === "yes",
      adults: c.adults,
      children: c.children,
      area: c.area || null,
      heard_from: c.heardFrom ?? null,
      consent_at: now.toISOString(),
    });
    // 23505 = this phone already checked in today. Answer exactly as for a new check-in,
    // so the form can't be used to find out whether someone was at church.
    if (error && error.code !== "23505") throw error;
    return {
      ok: true,
      message:
        c.firstTime === "yes"
          ? `Mwaiseni, ${c.name}! We’re so glad you came. Someone from our welcome team will greet you on WhatsApp.`
          : `Welcome, ${c.name}! You’re checked in for today’s ${service}.`,
    };
  } catch (e) {
    console.error("submitCheckIn", e);
    return { ok: false, message: "Something went wrong. Please try again, or tell an usher." };
  }
}
