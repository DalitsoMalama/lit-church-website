import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckInForm, TodayLabel } from "@/components/CheckInForm";
import { Ribbon } from "@/components/street";

export const metadata: Metadata = {
  title: "Check in",
  description: "Check in to today’s service at Living Temples Church.",
  robots: { index: false },
};

// Opened by scanning the QR poster at the venue (see /checkin/poster).
// Ushers with a shared tablet should use /checkin?kiosk=1 (never remembers anyone).
export default function CheckInPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      <header className="enter text-center">
        <Ribbon>
          <TodayLabel />
        </Ribbon>
        <h1 className="text-street-lg mt-6">
          <span lang="bem" className="text-flame">
            Mwaiseni!
          </span>
          <br />
          Check in
        </h1>
        <p className="mt-4 text-muted">It takes 20 seconds and helps us welcome and care for you.</p>
      </header>
      <div className="card mt-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-background" />}>
          <CheckInForm />
        </Suspense>
      </div>
    </div>
  );
}
