"use client";

import { useActionState } from "react";
import { unlockAttendance } from "@/app/attendance/actions";

export function PinForm() {
  const [state, action, pending] = useActionState(unlockAttendance, { error: "" });
  return (
    <form action={action} className="card max-w-sm space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">Staff PIN</span>
        <input name="pin" type="password" inputMode="numeric" autoComplete="off" required className="field" />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-flame-red">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending ? "Checking…" : "View attendance"}
      </button>
    </form>
  );
}
