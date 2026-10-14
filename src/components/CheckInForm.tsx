"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState, useSyncExternalStore } from "react";
import { submitCheckIn, type FormState } from "@/app/actions";
import { formatServiceDateLong } from "@/lib/service";
import { Field } from "./forms";
import { useSite } from "./SiteProvider";
import { keepValues } from "./useSubmit";
import { WhatsApp } from "./icons";
import { Flame } from "./street";

const KEY = "lit_member";
type Member = { name: string; phone: string };

// Remembered member on this phone (localStorage), read without hydration mismatches.
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const write = (m: Member | null) => {
  try {
    if (m) localStorage.setItem(KEY, JSON.stringify(m));
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
};

const heardOptions = [
  ["street_outreach", "Street outreach"],
  ["friend_family", "A friend or family"],
  ["whatsapp", "WhatsApp"],
  ["social_media", "Facebook / social media"],
  ["passing_by", "Passing by"],
  ["other", "Other"],
] as const;

const initial: FormState = { ok: false, message: "" };

/** Parses the remembered member, ignoring anything malformed or tampered with. */
function parseMember(raw: string | null): Member | null {
  if (!raw) return null;
  try {
    const m = JSON.parse(raw);
    return typeof m?.name === "string" && typeof m?.phone === "string" && m.name.length <= 100 && m.phone.length <= 20
      ? { name: m.name, phone: m.phone }
      : null;
  } catch {
    return null;
  }
}

/** Shows only the last 3 digits, so a shared phone never reveals someone's full number. */
const maskPhone = (p: string) => {
  const d = p.replace(/\D/g, "");
  return d.length > 3 ? `••• ••• ${d.slice(-3)}` : "•••";
};

/**
 * Check-in form. `?kiosk=1` is for an usher's shared phone/tablet at the door:
 * it never remembers anyone and resets itself for the next person.
 */
export function CheckInForm() {
  const kiosk = useSearchParams().get("kiosk") === "1";
  const [round, setRound] = useState(0);
  return <CheckInRound key={round} kiosk={kiosk} onNext={() => setRound((r) => r + 1)} />;
}

function CheckInRound({ kiosk, onNext }: { kiosk: boolean; onNext: () => void }) {
  const site = useSite();
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const member = kiosk ? null : parseMember(raw);
  const [state, action, pending] = useActionState(async (prev: FormState, fd: FormData) => {
    const result = await submitCheckIn(prev, fd);
    if (result.ok && kiosk) window.setTimeout(onNext, 8000); // ready for the next person
    if (result.ok && !kiosk && fd.get("remember") === "on") {
      write({ name: String(fd.get("name")), phone: String(fd.get("phone")) });
    }
    return result;
  }, initial);
  const [notMe, setNotMe] = useState(false);

  if (state.ok) {
    return (
      <div role="status" className="flex flex-col items-center gap-5 py-6 text-center">
        <Flame className="ignite h-24 w-auto drop-shadow-[0_0_30px_rgba(232,96,26,0.6)]" />
        <p className="text-street-md">You’re checked in!</p>
        <p className="measure text-lead">{state.message}</p>
        {kiosk ? (
          <button type="button" onClick={onNext} className="btn-primary mt-2">
            Next person
          </button>
        ) : (
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href="/devotional" className="btn-outline">
            Today’s devotional
          </Link>
          {site.whatsapp.communityUrl && (
            <a href={site.whatsapp.communityUrl} className="btn-green">
              <WhatsApp /> Join our WhatsApp community
            </a>
          )}
        </div>
        )}
      </div>
    );
  }

  const quick = member && !notMe;

  return (
    <form
      action={action}
      onSubmit={keepValues(action)}
      className="space-y-6 [&:has(input[name=firstTime][value=yes]:checked)_.first-only]:block"
      noValidate
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Suspense>
        <ServiceParam />
      </Suspense>

      {quick ? (
        <>
          {/* One-tap check-in for someone this phone remembers */}
          <div className="rounded-3xl bg-lit-green p-6 text-white">
            <p className="text-street-label text-flyer-yellow">Welcome back</p>
            <p className="text-street-lg mt-2">{member.name.split(" ")[0]}</p>
            <p className="mt-1 text-sm text-white/70 tabular-nums">{maskPhone(member.phone)}</p>
          </div>
          <input type="hidden" name="name" value={member.name} />
          <input type="hidden" name="phone" value={member.phone} />
          <input type="hidden" name="firstTime" value="no" />
          <input type="hidden" name="consent" value="on" />
          <input type="hidden" name="remember" value="on" />
          <Headcount />
          <p className="text-xs text-muted">
            You agreed to our <a href="/privacy" className="underline">privacy notice</a> when you first checked in.
          </p>
        </>
      ) : (
        <>
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">Is this your first time at LIT?</legend>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["yes", "Yes, first time!"],
                  ["no", "I’ve been before"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="cursor-pointer rounded-2xl border-2 border-border bg-surface px-4 py-4 text-center font-display text-lg transition-colors has-[:checked]:border-flame has-[:checked]:bg-flame has-[:checked]:text-white has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-flame/20"
                >
                  <input
                    type="radio"
                    name="firstTime"
                    value={value}
                    required
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
            {state.errors?.firstTime && <p className="mt-2 text-xs font-medium text-flame-red">{state.errors.firstTime[0]}</p>}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" name="name" errors={state.errors}>
              <input name="name" required autoComplete="name" className="field" />
            </Field>
            <Field label="WhatsApp number" name="phone" errors={state.errors} hint="e.g. 097 123 4567">
              <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field" />
            </Field>
          </div>

          <Headcount />

          {/* First-timer questions: shown with CSS :has(), so they work even before JavaScript loads */}
          <div className="first-only hidden space-y-4">
            <Field label="Area you live in (optional)" name="area" errors={state.errors} hint="e.g. Chimwemwe, Riverside, Ndeke, Buchi">
              <input name="area" className="field" />
            </Field>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold">How did you hear about LIT? (optional)</legend>
              <div className="flex flex-wrap gap-2">
                {heardOptions.map(([value, label]) => (
                  <label
                    key={value}
                    className="cursor-pointer rounded-full border border-border bg-surface px-4 py-2 text-sm transition-colors has-[:checked]:border-lit-green has-[:checked]:bg-lit-green has-[:checked]:text-white"
                  >
                    <input type="radio" name="heardFrom" value={value} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="space-y-3 text-sm">
            {!kiosk && (
              <label className="flex items-start gap-3">
                <input type="checkbox" name="remember" defaultChecked className="mt-0.5 size-5 accent-flame" />
                <span>Remember me on this phone, so next time I can check in with one tap. (Untick on a shared phone.)</span>
              </label>
            )}
            <label className="flex items-start gap-3">
              <input type="checkbox" name="consent" required className="mt-0.5 size-5 accent-flame" />
              <span>
                I agree that Living Temples Church may record my attendance and contact me on WhatsApp.{" "}
                <a href="/privacy" className="underline">
                  Privacy notice
                </a>
              </span>
            </label>
            {state.errors?.consent && <p className="text-xs font-medium text-flame-red">{state.errors.consent[0]}</p>}
          </div>
        </>
      )}

      {state.message && !state.ok && (
        <p role="alert" className="rounded-xl bg-flame/10 p-3 text-sm text-flame-red">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-4 text-base disabled:opacity-60">
        {pending ? "Checking in…" : quick ? `Check in as ${member.name.split(" ")[0]}` : "Check in"}
      </button>

      {quick && (
        <button
          type="button"
          onClick={() => {
            setNotMe(true);
            write(null);
          }}
          className="block w-full text-center text-sm text-muted underline"
        >
          Not {member.name.split(" ")[0]}? Check in someone else
        </button>
      )}
    </form>
  );
}

/** "How many are with you?" steppers. Big tap targets for use at the door. */
function Headcount() {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold">How many of you are here today?</legend>
      <div className="grid grid-cols-2 gap-3">
        <Stepper name="adults" label="Adults (incl. you)" min={1} initial={1} />
        <Stepper name="children" label="Children" min={0} initial={0} />
      </div>
    </fieldset>
  );
}

function Stepper({ name, label, min, initial }: { name: string; label: string; min: number; initial: number }) {
  const [n, setN] = useState(initial);
  const btn =
    "flex size-11 items-center justify-center rounded-full border border-border text-xl transition-colors hover:border-flame disabled:opacity-30";
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 text-center">
      <input type="hidden" name={name} value={n} />
      <div className="flex items-center justify-between">
        <button type="button" className={btn} onClick={() => setN((v) => Math.max(min, v - 1))} disabled={n <= min} aria-label={`Fewer ${label}`}>
          −
        </button>
        <span className="text-street text-4xl tabular-nums" aria-live="polite">
          {n}
        </span>
        <button type="button" className={btn} onClick={() => setN((v) => Math.min(20, v + 1))} disabled={n >= 20} aria-label={`More ${label}`}>
          +
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">{label}</p>
    </div>
  );
}

/** Special events can use their own QR code, e.g. /checkin?service=Youth+Night */
function ServiceParam() {
  const service = useSearchParams().get("service");
  return service ? <input type="hidden" name="service" value={service.slice(0, 60)} /> : null;
}

/** Today's date, shown in the page header (client-side so the page can stay static). */
export function TodayLabel() {
  const today = useSyncExternalStore(
    () => () => {},
    () => formatServiceDateLong(new Date()),
    () => null,
  );
  return <>{today ?? "Today"}</>;
}
