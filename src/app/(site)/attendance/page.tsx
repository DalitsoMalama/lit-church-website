import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { PinForm } from "@/components/PinForm";
import { isUnlocked, MIN_PIN_LENGTH, pinConfigured, pinTooShort } from "@/lib/attendance-auth";
import { AttendanceReport, Notice } from "@/components/admin/AttendanceReport";
import { lockAttendance, unlockAttendance } from "./actions";

export const metadata: Metadata = { title: "Attendance", robots: { index: false, follow: false } };

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
  if (!(await isUnlocked())) return <PinForm action={unlockAttendance} />;

  return (
    <div className="space-y-12">
      <AttendanceReport />
      <form action={lockAttendance}>
        <button type="submit" className="btn-outline">
          Lock this page
        </button>
      </form>
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
