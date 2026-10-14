import Link from "next/link";
import { Suspense } from "react";
import { AttendanceReport } from "@/components/admin/AttendanceReport";
import { AdminHeader, DbNotice, Skeleton } from "@/components/admin/page";
import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "Attendance" };

async function Report() {
  await requireAdmin();
  return (
    <>
      <DbNotice />
      <AttendanceReport />
    </>
  );
}

export default function AttendanceAdmin() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader
        title="Attendance"
        intro="From the QR check-in at the venue. Ushers can also see this at /attendance with their PIN."
        actions={
          <>
            <Link href="/checkin/poster" target="_blank" className="btn-outline">
              QR poster ↗
            </Link>
            <Link href="/checkin?kiosk=1" target="_blank" className="btn-outline">
              Usher check-in ↗
            </Link>
          </>
        }
      />
      <Suspense fallback={<Skeleton />}>
        <Report />
      </Suspense>
    </div>
  );
}
