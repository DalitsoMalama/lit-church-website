"use client";

import { Suspense, useActionState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { FormState } from "@/app/actions";
import { whatsappLink } from "@/lib/site";
import { useSite } from "./SiteProvider";
import { keepValues } from "./useSubmit";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

const initial: FormState = { ok: false, message: "" };

export function IntakeForm({
  action,
  submitLabel,
  whatsappMessage,
  children,
}: {
  action: Action;
  submitLabel: string;
  whatsappMessage: string;
  children: (errors: FormState["errors"]) => ReactNode;
}) {
  const site = useSite();
  const [state, formAction, pending] = useActionState(action, initial);

  if (state.ok) {
    return (
      <div role="status" className="card space-y-4 border-lit-green">
        <p className="text-h4 text-lit-green">🔥 Received!</p>
        <p>{state.message}</p>
        <a href={whatsappLink(site, whatsappMessage)} className="btn-green">
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={keepValues(formAction)} className="space-y-4" noValidate>
      {/* Honeypot: hidden from people, bots fill it in */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Suspense>
        <ReferralInput />
      </Suspense>
      {children(state.errors)}
      {state.message && (
        <p role="alert" className="rounded-xl bg-flame/10 p-3 text-sm text-flame-red">
          {state.message}{" "}
          {!state.errors && (
            <a href={whatsappLink(site, whatsappMessage)} className="font-semibold underline">
              Open WhatsApp
            </a>
          )}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

export function Field({
  label,
  name,
  errors,
  hint,
  children,
}: {
  label: string;
  name: string;
  errors?: FormState["errors"];
  hint?: string;
  children: ReactNode;
}) {
  const err = errors?.[name]?.[0];
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && !err && <span className="block text-xs text-muted">{hint}</span>}
      {err && <span className="block text-xs font-medium text-flame-red">{err}</span>}
    </label>
  );
}

/** Contact fields shared by the visit and response forms. */
/**
 * Contact fields shared by the visit and response forms. Only name and WhatsApp are
 * required; with `compact`, the optional fields (plus any `extra`) sit behind a disclosure.
 */
export function ContactFields({
  errors,
  compact = false,
  extra,
}: {
  errors?: FormState["errors"];
  compact?: boolean;
  extra?: ReactNode;
}) {
  const optional = (
    <>
      <Field label="Area you live in" name="area" errors={errors} hint="e.g. Chimwemwe, Riverside, Ndeke, Buchi">
        <input name="area" className="field" />
      </Field>
      <Field label="Preferred language" name="language" errors={errors}>
        <select name="language" className="field" defaultValue="en">
          <option value="en">English</option>
          <option value="bem">Ichibemba</option>
        </select>
      </Field>
      {extra}
    </>
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" errors={errors}>
          <input name="name" required autoComplete="name" className="field" />
        </Field>
        <Field label="WhatsApp number" name="phone" errors={errors} hint="e.g. 097 123 4567">
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field" />
        </Field>
      </div>
      {compact ? (
        <details className="group rounded-xl border border-dashed border-border px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-muted [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">+ Add more details (optional)</span>
            <span className="hidden group-open:inline">− Fewer details</span>
          </summary>
          <div className="mt-4 space-y-4">{optional}</div>
        </details>
      ) : (
        optional
      )}
    </>
  );
}

export function Consent({ errors, text }: { errors?: FormState["errors"]; text?: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-1 size-5 accent-flame" />
        <span>
          {text ??
            "I agree that Living Temples Church may store these details and contact me by phone or WhatsApp. I can ask for my details to be deleted at any time."}{" "}
          <a href="/privacy" className="underline">
            Privacy notice
          </a>
        </span>
      </label>
      {errors?.consent?.[0] && <p className="mt-1 text-xs font-medium text-flame-red">{errors.consent[0]}</p>}
    </div>
  );
}

/** Carries an evangelist's QR/referral code (?ref=ABC123) through the form. */
function ReferralInput() {
  const ref = useSearchParams().get("ref");
  return ref ? <input type="hidden" name="ref" value={ref.slice(0, 20)} /> : null;
}
