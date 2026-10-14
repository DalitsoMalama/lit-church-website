"use client";

import { useActionState, useState } from "react";
import type { AdminState } from "@/app/admin/actions";
import type { Devotional } from "@/content/devotionals";
import { DAY_NAMES, type ChurchSettings } from "@/lib/site";
import { keepValues } from "../useSubmit";
import { STAGES } from "./labels";
import { emptyState, Field, SaveBar, SubmitButton } from "./ui";

type Action = (prev: AdminState, formData: FormData) => Promise<AdminState>;
const pad = (n: number) => String(n).padStart(2, "0");

/* ── Church details ────────────────────────────────────────────────── */

export function SettingsForm({ action, initial }: { action: Action; initial: ChurchSettings }) {
  const [state, formAction, pending] = useActionState(action, emptyState);
  const [groups, setGroups] = useState(() => initial.cellGroups.map((g, i) => ({ ...g, key: i })));
  const e = state.errors;
  const s = initial.service;

  return (
    <form action={formAction} onSubmit={keepValues(formAction)} className="card space-y-10 pb-0" noValidate>
      <fieldset className="space-y-4">
        <legend className="text-h4 mb-2">Sunday service</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Day" name="service.weekday" errors={e}>
            <select name="service.weekday" defaultValue={s.weekday} className="field">
              {DAY_NAMES.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Start time" name="service.startHour" errors={e} hint="Zambia time">
            <input type="time" name="service.time" required defaultValue={`${pad(s.startHour)}:${pad(s.startMinute)}`} className="field" />
          </Field>
          <Field label="Length (minutes)" name="service.durationMinutes" errors={e} hint="Used for “Happening now”">
            <input type="number" name="service.durationMinutes" min={15} max={600} defaultValue={s.durationMinutes} className="field" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Venue" name="service.venue" errors={e}>
            <input name="service.venue" required maxLength={100} defaultValue={s.venue} className="field" />
          </Field>
          <Field label="Address" name="service.address" errors={e} hint="Used for the map and directions">
            <input name="service.address" required maxLength={200} defaultValue={s.address} className="field" />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-h4 mb-2">Church</legend>
        <Field label="Mission statement" name="mission" errors={e}>
          <textarea name="mission" rows={2} maxLength={200} defaultValue={initial.mission} className="field" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Lead pastor" name="leadPastor" errors={e}>
            <input name="leadPastor" maxLength={80} defaultValue={initial.leadPastor} className="field" />
          </Field>
          <Field label="City" name="city" errors={e}>
            <input name="city" maxLength={80} defaultValue={initial.city} className="field" />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-h4 mb-2">WhatsApp</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Church WhatsApp number" name="whatsapp.number" errors={e} hint="With country code, e.g. 260971234567">
            <input name="whatsapp.number" inputMode="tel" maxLength={20} defaultValue={initial.whatsapp.number} className="field" />
          </Field>
          <Field label="WhatsApp community link" name="whatsapp.communityUrl" errors={e} hint="https://chat.whatsapp.com/…">
            <input name="whatsapp.communityUrl" type="url" maxLength={300} defaultValue={initial.whatsapp.communityUrl} className="field" />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-h4 mb-2">Cell groups</legend>
        {groups.map((g, i) => (
          <div key={g.key} className="grid items-end gap-3 rounded-2xl border border-border p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <Field label="Area" name={`cellGroups.${i}.area`} errors={e}>
              <input name={`cellGroups.${i}.area`} maxLength={60} defaultValue={g.area} className="field" />
            </Field>
            <Field label="Leader" name={`cellGroups.${i}.leader`} errors={e}>
              <input name={`cellGroups.${i}.leader`} maxLength={80} defaultValue={g.leader} placeholder="To be announced" className="field" />
            </Field>
            <Field label="Meets" name={`cellGroups.${i}.meetingTime`} errors={e}>
              <input name={`cellGroups.${i}.meetingTime`} maxLength={80} defaultValue={g.meetingTime} placeholder="e.g. Wednesdays 18:00" className="field" />
            </Field>
            <button
              type="button"
              onClick={() => setGroups(groups.filter((x) => x.key !== g.key))}
              className="btn-outline px-4 py-3 text-flame-red"
              aria-label={`Remove ${g.area || "cell group"}`}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setGroups([...groups, { area: "", leader: "", meetingTime: "", key: Date.now() }])}
          className="btn-outline"
        >
          + Add cell group
        </button>
      </fieldset>

      <SaveBar state={state} pending={pending} />
    </form>
  );
}

/* ── Sermon ────────────────────────────────────────────────────────── */

export type SermonValues = {
  title: string;
  series: string;
  speaker: string;
  preachedOn: string;
  scripture: string;
  summary: string;
  videoUrl: string;
  audioUrl: string;
  published: boolean;
};

export function SermonForm({ action, initial }: { action: Action; initial: SermonValues }) {
  const [state, formAction, pending] = useActionState(action, emptyState);
  const e = state.errors;
  return (
    <form action={formAction} onSubmit={keepValues(formAction)} className="card space-y-5 pb-0" noValidate>
      <Field label="Title" name="title" errors={e}>
        <input name="title" required maxLength={150} defaultValue={initial.title} className="field" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Speaker" name="speaker" errors={e}>
          <input name="speaker" required maxLength={100} defaultValue={initial.speaker} className="field" />
        </Field>
        <Field label="Date preached" name="preachedOn" errors={e}>
          <input name="preachedOn" type="date" required defaultValue={initial.preachedOn} className="field" />
        </Field>
        <Field label="Scripture" name="scripture" errors={e}>
          <input name="scripture" maxLength={100} defaultValue={initial.scripture} placeholder="e.g. Ephesians 2:8-9" className="field" />
        </Field>
      </div>
      <Field label="Series" name="series" errors={e}>
        <input name="series" maxLength={100} defaultValue={initial.series} className="field" />
      </Field>
      <Field label="Summary" name="summary" errors={e}>
        <textarea name="summary" rows={3} maxLength={1000} defaultValue={initial.summary} className="field" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="YouTube or Facebook video link" name="videoUrl" errors={e} hint="Paste the full https:// link">
          <input name="videoUrl" type="url" maxLength={300} defaultValue={initial.videoUrl} className="field" />
        </Field>
        <Field label="Audio link (optional)" name="audioUrl" errors={e} hint="An https:// link to an MP3">
          <input name="audioUrl" type="url" maxLength={300} defaultValue={initial.audioUrl} className="field" />
        </Field>
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name="published" defaultChecked={initial.published} className="size-5 accent-flame" />
        Show on the website
      </label>
      <SaveBar state={state} label="Save sermon" pending={pending} />
    </form>
  );
}

/* ── Devotional ────────────────────────────────────────────────────── */

export function DevotionalForm({ action, initial }: { action: Action; initial: Devotional }) {
  const [state, formAction, pending] = useActionState(action, emptyState);
  const e = state.errors;
  return (
    <form action={formAction} onSubmit={keepValues(formAction)} className="card space-y-5 pb-0" noValidate>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <Field label="Title" name="title" errors={e}>
          <input name="title" required maxLength={120} defaultValue={initial.title} className="field" />
        </Field>
        <Field label="Scripture reference" name="scripture" errors={e} hint="e.g. John 3:16">
          <input name="scripture" required maxLength={60} defaultValue={initial.scripture} className="field" />
        </Field>
      </div>
      <Field label="Verse text (optional)" name="verseText" errors={e} hint="Quote at most a few verses and name the translation, e.g. NKJV">
        <textarea name="verseText" rows={3} maxLength={1000} defaultValue={initial.verseText ?? ""} className="field" />
      </Field>
      <Field label="Reflection" name="reflection" errors={e}>
        <textarea name="reflection" rows={8} required maxLength={4000} defaultValue={initial.reflection} className="field" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Prayer" name="prayer" errors={e}>
          <textarea name="prayer" rows={4} maxLength={1000} defaultValue={initial.prayer} className="field" />
        </Field>
        <Field label="Declaration" name="declaration" errors={e}>
          <textarea name="declaration" rows={4} maxLength={500} defaultValue={initial.declaration} className="field" />
        </Field>
        <Field label="Today’s action" name="action" errors={e}>
          <textarea name="action" rows={4} maxLength={500} defaultValue={initial.action} className="field" />
        </Field>
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-lit-green/30 bg-lit-green/5 p-4 text-sm font-semibold">
        <input type="checkbox" name="approved" defaultChecked={initial.approved} className="size-5 accent-[var(--lit-green)]" />
        Approved by the Reverend / Elders
      </label>
      <SaveBar state={state} label="Save devotional" pending={pending} />
    </form>
  );
}

/* ── Follow-up ─────────────────────────────────────────────────────── */

export function FollowupForm({ action, stage, notes }: { action: Action; stage: string; notes: string }) {
  const [state, formAction, pending] = useActionState(action, emptyState);
  return (
    <form action={formAction} onSubmit={keepValues(formAction)} className="card space-y-4">
      <h2 className="text-h4">Follow-up</h2>
      <Field label="Stage" name="stage" errors={state.errors}>
        <select name="stage" defaultValue={stage} className="field">
          {STAGES.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Notes (only staff can see these)" name="notes" errors={state.errors}>
        <textarea name="notes" rows={5} maxLength={2000} defaultValue={notes} className="field" />
      </Field>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name="contactedNow" className="size-5 accent-flame" />I contacted them today
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton label="Save follow-up" pending={pending} />
        {state.message && (
          <p role={state.ok ? "status" : "alert"} className={`text-sm font-medium ${state.ok ? "text-lit-green" : "text-flame-red"}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

/* ── Prayer request status ─────────────────────────────────────────── */

export function PrayerStatusForm({ action, status, testimony }: { action: Action; status: string; testimony: string }) {
  const [state, formAction, pending] = useActionState(action, emptyState);
  return (
    <form action={formAction} onSubmit={keepValues(formAction)} className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr_auto] sm:items-end">
      <Field label="Status" name="status" errors={state.errors}>
        <select name="status" defaultValue={status} className="field py-2.5">
          <option value="open">Open</option>
          <option value="praying">Praying</option>
          <option value="answered">Answered 🙌</option>
          <option value="archived">Archived</option>
        </select>
      </Field>
      <Field label="Testimony (if answered)" name="testimony" errors={state.errors}>
        <input name="testimony" maxLength={1500} defaultValue={testimony} className="field py-2.5" />
      </Field>
      <div className="flex items-center gap-3">
        <SubmitButton label="Save" className="btn-outline" pending={pending} />
        {state.message && <span className={`text-sm ${state.ok ? "text-lit-green" : "text-flame-red"}`}>{state.message}</span>}
      </div>
    </form>
  );
}
