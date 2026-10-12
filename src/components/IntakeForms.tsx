"use client";

import { useEffect, useRef } from "react";
import { submitPrayer, submitResponse, submitVisit } from "@/app/actions";
import { Consent, ContactFields, Field, IntakeForm } from "./forms";

export function VisitForm() {
  return (
    <IntakeForm
      action={submitVisit}
      submitLabel="Plan my visit"
      whatsappMessage="Hello LIT Church, I have planned to visit this Sunday."
    >
      {(errors) => (
        <>
          <ContactFields errors={errors} />
          <Field label="Which Sunday? (optional)" name="visitDate" errors={errors}>
            <input name="visitDate" type="date" className="field" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Adults" name="adults" errors={errors}>
              <input name="adults" type="number" min={1} max={20} defaultValue={1} className="field" />
            </Field>
            <Field label="Children" name="kids" errors={errors}>
              <input name="kids" type="number" min={0} max={20} defaultValue={0} className="field" />
            </Field>
          </div>
          <Field label="Anything we should know? (optional)" name="notes" errors={errors}>
            <textarea name="notes" rows={3} maxLength={500} className="field" />
          </Field>
          <Consent errors={errors} />
        </>
      )}
    </IntakeForm>
  );
}

export const decisions = [
  { value: "gave_life_to_jesus", label: "I gave my life to Jesus" },
  { value: "rededicated", label: "I’m coming back to Jesus" },
  { value: "wants_water_baptism", label: "I want water baptism" },
  { value: "wants_holy_spirit_prayer", label: "Pray for me to receive the Holy Spirit" },
  { value: "has_questions", label: "I have questions" },
] as const;

export function ResponseForm() {
  const fieldset = useRef<HTMLFieldSetElement>(null);

  // "I prayed" / "I have questions" buttons elsewhere on the page pre-select a response
  useEffect(() => {
    const pick = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      const input = fieldset.current?.querySelector<HTMLInputElement>(`input[value="${value}"]`);
      if (input) input.checked = true;
    };
    window.addEventListener("lit:decision", pick);
    return () => window.removeEventListener("lit:decision", pick);
  }, []);

  return (
    <IntakeForm
      action={submitResponse}
      submitLabel="Send my response"
      whatsappMessage="Hello LIT Church, I responded on the Know Jesus page and would like to talk."
    >
      {(errors) => (
        <>
          <fieldset ref={fieldset}>
            <legend className="mb-3 text-sm font-semibold">My response</legend>
            <div className="flex flex-wrap gap-2">
              {decisions.map((d, i) => (
                <label
                  key={d.value}
                  className="cursor-pointer rounded-full border border-border bg-surface px-4 py-2.5 text-sm transition-colors has-[:checked]:border-flame has-[:checked]:bg-flame has-[:checked]:text-white has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-flame/20"
                >
                  <input type="radio" name="decision" value={d.value} defaultChecked={i === 0} className="sr-only" />
                  {d.label}
                </label>
              ))}
            </div>
          </fieldset>
          <ContactFields
            errors={errors}
            compact
            extra={
              <Field label="Anything you would like to share?" name="notes" errors={errors}>
                <textarea name="notes" rows={3} maxLength={500} className="field" />
              </Field>
            }
          />
          <Consent errors={errors} />
        </>
      )}
    </IntakeForm>
  );
}

export function PrayerForm() {
  return (
    <IntakeForm
      action={submitPrayer}
      submitLabel="Send prayer request"
      whatsappMessage="Hello LIT Church, please pray with me."
    >
      {(errors) => (
        <>
          <Field label="Your name (optional)" name="name" errors={errors}>
            <input name="name" autoComplete="name" className="field" />
          </Field>
          <Field label="Phone / WhatsApp (optional, if you'd like us to call)" name="phone" errors={errors}>
            <input name="phone" type="tel" inputMode="tel" className="field" />
          </Field>
          <Field label="What can we pray about?" name="category" errors={errors}>
            <select name="category" className="field" defaultValue="other">
              <option value="salvation">Salvation</option>
              <option value="healing">Healing</option>
              <option value="family">Family &amp; marriage</option>
              <option value="work_finances">Work &amp; finances</option>
              <option value="deliverance">Deliverance</option>
              <option value="holy_spirit">Baptism of the Holy Spirit</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Your prayer request" name="request" errors={errors}>
            <textarea name="request" rows={5} required maxLength={1500} className="field" />
          </Field>
          <Field label="Who may see this?" name="visibility" errors={errors}>
            <select name="visibility" className="field" defaultValue="team">
              <option value="team">LIT prayer team</option>
              <option value="private">Only the Reverend &amp; Elders</option>
            </select>
          </Field>
          <Consent
            errors={errors}
            text="I agree that Living Temples Church may store this request and, if I gave my number, contact me about it."
          />
        </>
      )}
    </IntakeForm>
  );
}
