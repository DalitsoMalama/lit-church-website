import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { PinForm } from "@/components/PinForm";
import { isUnlocked, MIN_PIN_LENGTH, pinConfigured, pinTooShort } from "@/lib/attendance-auth";
import { lusakaDate } from "@/lib/service";
import { adminClient } from "@/lib/supabase/admin";
import { lockAttendance } from "./actions";

export const metadata: Metadata = { title: "Attendance", robots: { index: false, follow: false } };

type Summary = {
  service_date: string;
  service: string;
  check_ins: number;
  adults: number;
  children: number;
  total_people: number;
  first_timers: number;
};
type FirstTimer = { name: string; area: string | null; heard_from: string | null; adults: number; children: number };

const heard: Record<string, string> = {
  street_outreach: "Street outreach",
  friend_family: "Friend / family",
  whatsapp: "WhatsApp",
  social_media: "Social media",
  passing_by: "Passing by",
  other: "Other",
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-ZM", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

async function Report() {
  await connection(); // always per request: depends on the PIN cookie and today's data
  if (!pinConfigured()) {
    return <Notice title="Set an attendance PIN">Add <code>ATTENDANCE_PIN</code> to the environment variables to enable this page.</Notice>;
  }
  if (pinTooShort()) {
    return (
      <Notice title="Attendance PIN is too short">
        For security the PIN must be at least {MIN_PIN_LENGTH} characters. Update <code>ATTENDANCE_PIN</code>.
      </Notice>
    );
  }
  if (!(await isUnlocked())) return <PinForm />;

  const db = adminClient();
  if (!db) {
    return (
      <Notice title="Database not connected">
        Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> to see attendance.
      </Notice>
    );
  }

  const today = lusakaDate();
  const [{ data: summary, error }, { data: firstTimers }] = await Promise.all([
    db.from("attendance_summary").select("*").limit(16),
    db
      .from("attendance")
      .select("name, area, heard_from, adults, children")
      .eq("service_date", today)
      .eq("first_time", true)
      .order("created_at"),
  ]);
  if (error) return <Notice title="Could not load attendance">{error.message}</Notice>;

  const rows = (summary ?? []) as Summary[];
  const todayRows = rows.filter((r) => r.service_date === today);
  const t = todayRows.reduce(
    (a, r) => ({ total: a.total + r.total_people, checkIns: a.checkIns + r.check_ins, first: a.first + r.first_timers }),
    { total: 0, checkIns: 0, first: 0 },
  );

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-street-label text-muted">Today · {fmt(today)}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            ["People present", t.total],
            ["Check-ins", t.checkIns],
            ["First-time guests", t.first],
          ].map(([label, n]) => (
            <div key={label} className="card flex flex-col-reverse">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="text-street text-6xl tabular-nums">{n}</dd>
            </div>
          ))}
        </dl>
      </section>

      {(firstTimers ?? []).length > 0 && (
        <section>
          <h2 className="text-h3">First-time guests today</h2>
          <p className="mt-1 text-sm text-muted">Each one has a follow-up due within 24 hours.</p>
          <ul className="mt-4 divide-y divide-border rounded-3xl border border-border bg-surface">
            {(firstTimers as FirstTimer[]).map((f, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4">
                <span className="font-medium">{f.name}</span>
                <span className="text-sm text-muted">
                  {[f.area, f.heard_from && heard[f.heard_from], `${f.adults + f.children} in party`].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-h3">Recent services</h2>
        <div className="mt-4 overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-street-label text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Service</th>
                <th className="px-5 py-4 text-right font-medium">Adults</th>
                <th className="px-5 py-4 text-right font-medium">Children</th>
                <th className="px-5 py-4 text-right font-medium">Total</th>
                <th className="px-5 py-4 text-right font-medium">First-time</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted">
                    No check-ins yet. Print the <Link href="/checkin/poster" className="underline">QR poster</Link> to get started.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={`${r.service_date}-${r.service}`} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">{fmt(r.service_date)}</td>
                  <td className="px-5 py-3">{r.service}</td>
                  <td className="px-5 py-3 text-right">{r.adults}</td>
                  <td className="px-5 py-3 text-right">{r.children}</td>
                  <td className="px-5 py-3 text-right font-semibold">{r.total_people}</td>
                  <td className="px-5 py-3 text-right">{r.first_timers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          Full contact details are in the Supabase dashboard (table <code>attendance</code>) until staff sign-in is
          added.
        </p>
      </section>

      <form action={lockAttendance}>
        <button type="submit" className="btn-outline">
          Lock this page
        </button>
      </form>
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card space-y-2">
      <h2 className="text-h4">{title}</h2>
      <p className="text-muted">{children}</p>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:py-24">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Staff</p>
          <h1 className="text-h1 mt-4">Attendance</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/checkin/poster" className="btn-outline">
            QR poster
          </Link>
          <Link href="/checkin" className="btn-outline">
            Check-in page
          </Link>
        </div>
      </header>
      <Suspense fallback={<div className="card h-48 animate-pulse" />}>
        <Report />
      </Suspense>
    </div>
  );
}
