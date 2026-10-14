"use client";

import { startTransition, type FormEvent } from "react";

/**
 * React 19 clears a form after every action submission, so a validation error would wipe
 * everything the person typed. This submits the same action without the reset:
 * use as <form action={formAction} onSubmit={keepValues(formAction)}>. The `action`
 * stays as the no-JavaScript fallback.
 */
export function keepValues(formAction: (formData: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    const data = new FormData(e.currentTarget, submitter instanceof HTMLElement ? submitter : null);
    startTransition(() => formAction(data));
  };
}
