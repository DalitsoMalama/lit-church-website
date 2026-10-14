"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { AdminState } from "@/app/admin/actions";

export const emptyState: AdminState = { ok: false, message: "" };

export function Field({
  label,
  name,
  errors,
  hint,
  children,
}: {
  label: string;
  name: string;
  errors?: AdminState["errors"];
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

export function SaveBar({ state, label = "Save changes", pending }: { state: AdminState; label?: string; pending?: boolean }) {
  return (
    <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-4 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
      <SubmitButton label={label} pending={pending} />
      {state.message && (
        <p role={state.ok ? "status" : "alert"} className={`text-sm font-medium ${state.ok ? "text-lit-green" : "text-flame-red"}`}>
          {state.ok ? "✓ " : ""}
          {state.message}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ label, className = "btn-primary", pending }: { label: string; className?: string; pending?: boolean }) {
  const status = useFormStatus();
  const busy = pending ?? status.pending;
  return (
    <button type="submit" disabled={busy} className={`${className} disabled:opacity-60`}>
      {busy ? "Saving…" : label}
    </button>
  );
}

/** Submit button that asks "Are you sure?" first (for delete/reset). */
export function ConfirmSubmit({ label, question, className = "btn-outline" }: { label: string; question: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(question)) e.preventDefault();
      }}
      className={`${className} disabled:opacity-60`}
    >
      {pending ? "Working…" : label}
    </button>
  );
}
