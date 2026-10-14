"use client";

import { useActionState } from "react";

type Unlock = (prev: { error: string }, formData: FormData) => Promise<{ error: string }>;

/** Password/PIN prompt for staff pages (attendance report, admin sign-in). */
export function PinForm({
  action,
  label = "Staff PIN",
  button = "View attendance",
  numeric = false,
}: {
  action: Unlock;
  label?: string;
  button?: string;
  numeric?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });
  return (
    <form action={formAction} className="card max-w-sm space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">{label}</span>
        <input
          name="pin"
          type="password"
          inputMode={numeric ? "numeric" : "text"}
          autoComplete={numeric ? "off" : "current-password"}
          required
          autoFocus
          className="field"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-flame-red">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending ? "Checking…" : button}
      </button>
    </form>
  );
}
