import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Logo } from "@/components/Logo";
import { PinForm } from "@/components/PinForm";
import { ADMIN, configured, tooShort } from "@/lib/staff-auth";
import { signIn } from "../actions";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

async function Gate() {
  await connection(); // reads environment at request time
  if (!configured(ADMIN)) {
    return (
      <p className="card text-sm text-muted">
        The admin side is switched off. Add <code>ADMIN_PASSWORD</code> (at least {ADMIN.minLength} characters) to the
        environment variables to turn it on.
      </p>
    );
  }
  if (tooShort(ADMIN)) {
    return (
      <p className="card text-sm text-muted">
        <code>ADMIN_PASSWORD</code> must be at least {ADMIN.minLength} characters. Please set a longer one.
      </p>
    );
  }
  return <PinForm action={signIn} label="Admin password" button="Sign in" />;
}

export default function AdminLogin() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-5 py-16">
      <Link href="/" aria-label="LIT Church home">
        <Logo />
      </Link>
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-h2 text-center">Staff sign in</h1>
        <Suspense fallback={<div className="card h-40 animate-pulse" />}>
          <Gate />
        </Suspense>
        <p className="text-center text-xs text-muted">
          After 5 wrong attempts sign-in is paused for 15 minutes.
        </p>
      </div>
    </main>
  );
}
