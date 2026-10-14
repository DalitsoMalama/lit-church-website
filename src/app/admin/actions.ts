"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminDb, DatabaseNotConnected, nestFields, requireAdmin } from "@/lib/admin";
import { SERIES, TAGS } from "@/lib/content";
import { rateLimit } from "@/lib/rate-limit";
import { ADMIN, checkPassword, cookieOptions, issueToken } from "@/lib/staff-auth";
import {
  devotionalSchema,
  followupSchema,
  formFields,
  prayerUpdateSchema,
  sermonSchema,
  settingsSchema,
} from "@/lib/validation";

export type AdminState = { ok: boolean; message: string; errors?: Record<string, string[]> };

const failed = (e: unknown, what: string): AdminState => {
  if (e instanceof DatabaseNotConnected) return { ok: false, message: "The database isn’t connected yet." };
  console.error(what, e);
  return { ok: false, message: `Could not save ${what}. Please try again.` };
};
/** Errors keyed by full field path ("service.venue", "cellGroups.2.area") to match the form inputs. */
const invalid = (error: z.ZodError): AdminState => {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) (errors[issue.path.join(".")] ??= []).push(issue.message);
  return { ok: false, message: "Please fix the highlighted fields.", errors };
};

/* ── Sign in / out ─────────────────────────────────────────────────── */

export async function signIn(_prev: { error: string }, formData: FormData) {
  if (!(await rateLimit("admin-password", 5, 15 * 60 * 1000))) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }
  if (!checkPassword(ADMIN, String(formData.get("pin") ?? ""))) {
    await new Promise((r) => setTimeout(r, 800));
    return { error: "That password is not correct." };
  }
  (await cookies()).set(ADMIN.cookie, issueToken(ADMIN), cookieOptions(ADMIN));
  redirect("/admin");
}

export async function signOut() {
  (await cookies()).delete({ name: ADMIN.cookie, path: ADMIN.path });
  redirect("/admin/login");
}

/* ── Church details ────────────────────────────────────────────────── */

export async function saveSettings(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();
  const raw = nestFields(formFields(formData)) as Record<string, Record<string, unknown>>;
  // <input type="time"> gives "08:00"
  const [h, m] = String(raw.service?.time ?? "").split(":");
  raw.service = { ...raw.service, startHour: h, startMinute: m };
  raw.cellGroups ??= [] as unknown as Record<string, unknown>;

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { error } = await adminDb()
      .from("site_settings")
      .upsert({ id: 1, data: parsed.data, updated_at: new Date().toISOString() });
    if (error) throw error;
    updateTag(TAGS.settings);
    return { ok: true, message: "Saved. The website now shows these details." };
  } catch (e) {
    return failed(e, "church details");
  }
}

/* ── Sermons ───────────────────────────────────────────────────────── */

export async function saveSermon(id: string | null, _prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();
  const parsed = sermonSchema.safeParse(formFields(formData));
  if (!parsed.success) return invalid(parsed.error);
  const s = parsed.data;
  const row = {
    title: s.title,
    series: s.series || null,
    speaker: s.speaker,
    preached_on: s.preachedOn,
    scripture: s.scripture || null,
    summary: s.summary || null,
    video_url: s.videoUrl || null,
    audio_url: s.audioUrl || null,
    published: s.published === "on",
    updated_at: new Date().toISOString(),
  };
  try {
    const db = adminDb();
    const { error } = id ? await db.from("sermons").update(row).eq("id", id) : await db.from("sermons").insert(row);
    if (error) throw error;
    updateTag(TAGS.sermons);
    revalidatePath("/admin/sermons");
  } catch (e) {
    return failed(e, "the sermon");
  }
  redirect("/admin/sermons?saved=1");
}

export async function deleteSermon(id: string) {
  await requireAdmin();
  const { error } = await adminDb().from("sermons").delete().eq("id", id);
  if (error) throw error;
  updateTag(TAGS.sermons);
  redirect("/admin/sermons?deleted=1");
}

/* ── Devotionals ───────────────────────────────────────────────────── */

export async function saveDevotional(day: number, _prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();
  if (!Number.isInteger(day) || day < 1 || day > 366) return { ok: false, message: "Unknown day." };
  const parsed = devotionalSchema.safeParse(formFields(formData));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const approved = d.approved === "on";
  try {
    const { error } = await adminDb()
      .from("devotional_days")
      .upsert({
        series: SERIES,
        day,
        title: d.title,
        scripture_ref: d.scripture,
        verse_text: d.verseText || null,
        reflection: d.reflection,
        prayer: d.prayer || null,
        declaration: d.declaration || null,
        action: d.action || null,
        approved,
        approved_at: approved ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      });
    if (error) throw error;
    updateTag(TAGS.devotionals);
    revalidatePath("/admin/devotionals");
    return { ok: true, message: approved ? "Saved and approved." : "Saved as draft." };
  } catch (e) {
    return failed(e, "the devotional");
  }
}

/** Removes the saved edit so the day goes back to its original built-in text. */
export async function resetDevotional(day: number) {
  await requireAdmin();
  const { error } = await adminDb().from("devotional_days").delete().eq("series", SERIES).eq("day", day);
  if (error) throw error;
  updateTag(TAGS.devotionals);
  redirect(`/admin/devotionals/${day}?reset=1`);
}

/* ── People & follow-up ────────────────────────────────────────────── */

export async function updateFollowup(personId: string, _prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(personId)) return { ok: false, message: "Unknown person." };
  const parsed = followupSchema.safeParse(formFields(formData));
  if (!parsed.success) return invalid(parsed.error);
  const f = parsed.data;
  const now = new Date().toISOString();
  try {
    const db = adminDb();
    const { error } = await db
      .from("followups")
      .update({ stage: f.stage, notes: f.notes || null, ...(f.contactedNow ? { last_contact_at: now } : {}) })
      .eq("person_id", personId);
    if (error) throw error;
    await db.from("people").update({ status: f.stage }).eq("id", personId);
    if (f.contactedNow) {
      await db.from("journey_events").insert({ person_id: personId, type: "contacted", payload: { stage: f.stage } });
    }
    revalidatePath("/admin/people");
    revalidatePath(`/admin/people/${personId}`);
    return { ok: true, message: f.contactedNow ? "Saved and marked as contacted today." : "Saved." };
  } catch (e) {
    return failed(e, "the follow-up");
  }
}

/* ── Prayer requests ───────────────────────────────────────────────── */

export async function updatePrayer(id: string, _prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, message: "Unknown request." };
  const parsed = prayerUpdateSchema.safeParse(formFields(formData));
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { error } = await adminDb()
      .from("prayer_requests")
      .update({
        status: parsed.data.status,
        testimony: parsed.data.testimony || null,
      })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/prayer");
    return { ok: true, message: "Saved." };
  } catch (e) {
    return failed(e, "the prayer request");
  }
}
