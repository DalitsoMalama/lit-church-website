import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { devotionals as builtInDevotionals, type Devotional } from "@/content/devotionals";
import { sermons as builtInSermons, type Sermon } from "@/content/sermons";
import { buildSite, defaultSettings, type ChurchSettings } from "./site";
import { publicClient, supabaseConfigured } from "./supabase/server";
import { settingsSchema } from "./validation";

/*
 * Content shown on the public site. Each loader is cached (pages stay fast and mostly
 * static) and tagged; the admin side calls updateTag(tag) after saving, so changes
 * appear immediately. If the database is unreachable, the built-in content is used.
 */

export const TAGS = { settings: "settings", sermons: "sermons", devotionals: "devotionals" } as const;
export const SERIES = "come-as-you-are";

/** Saved church details merged over the built-in defaults (invalid saved data is ignored). */
export async function getSettings(): Promise<ChurchSettings> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("days");
  if (!supabaseConfigured) return defaultSettings;
  try {
    const { data, error } = await publicClient().from("site_settings").select("data").eq("id", 1).maybeSingle();
    if (error || !data?.data || Object.keys(data.data).length === 0) return defaultSettings;
    const merged = {
      ...defaultSettings,
      ...data.data,
      service: { ...defaultSettings.service, ...data.data.service },
      whatsapp: { ...defaultSettings.whatsapp, ...data.data.whatsapp },
    };
    const parsed = settingsSchema.safeParse(merged);
    return parsed.success ? parsed.data : defaultSettings;
  } catch (e) {
    console.error("getSettings", e);
    return defaultSettings;
  }
}

/** Church details as pages use them (with service day/time labels and map links). */
export async function getSite() {
  return buildSite(await getSettings());
}

type SermonRow = {
  id: string;
  title: string;
  series: string | null;
  speaker: string;
  preached_on: string;
  scripture: string | null;
  summary: string | null;
  video_url: string | null;
  audio_url: string | null;
};

const toSermon = (r: SermonRow): Sermon => ({
  slug: r.id,
  title: r.title,
  series: r.series ?? undefined,
  speaker: r.speaker,
  date: r.preached_on,
  scripture: r.scripture ?? undefined,
  summary: r.summary ?? undefined,
  videoUrl: r.video_url ?? undefined,
  audioUrl: r.audio_url ?? undefined,
});

/** Published sermons, newest first. */
export async function getSermons(): Promise<Sermon[]> {
  "use cache";
  cacheTag(TAGS.sermons);
  cacheLife("days");
  if (!supabaseConfigured) return builtInSermons;
  try {
    const { data, error } = await publicClient()
      .from("sermons")
      .select("id,title,series,speaker,preached_on,scripture,summary,video_url,audio_url")
      .eq("published", true)
      .order("preached_on", { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data as SermonRow[]).map(toSermon);
  } catch (e) {
    console.error("getSermons", e);
    return builtInSermons;
  }
}

type DevotionalRow = {
  day: number;
  title: string;
  scripture_ref: string;
  verse_text: string | null;
  reflection: string;
  prayer: string | null;
  declaration: string | null;
  action: string | null;
  approved: boolean;
};

/** The 28-day series: built-in text with any admin edits/approvals applied on top. */
export async function getDevotionals(): Promise<Devotional[]> {
  "use cache";
  cacheTag(TAGS.devotionals);
  cacheLife("days");
  if (!supabaseConfigured) return builtInDevotionals;
  try {
    const { data, error } = await publicClient().from("devotional_days").select("*").eq("series", SERIES);
    if (error) throw error;
    const edits = new Map((data as DevotionalRow[]).map((r) => [r.day, r]));
    return builtInDevotionals.map((d) => {
      const r = edits.get(d.day);
      return r
        ? {
            ...d,
            title: r.title,
            scripture: r.scripture_ref,
            verseText: r.verse_text ?? undefined,
            reflection: r.reflection,
            prayer: r.prayer ?? "",
            declaration: r.declaration ?? "",
            action: r.action ?? "",
            approved: r.approved,
          }
        : d;
    });
  } catch (e) {
    console.error("getDevotionals", e);
    return builtInDevotionals;
  }
}

export async function getDevotionalDay(day: number) {
  return (await getDevotionals()).find((d) => d.day === day);
}
