import Link from "next/link";
import { Suspense } from "react";
import { AdminHeader, DbNotice, Skeleton } from "@/components/admin/page";
import { adminDb, dbConnected, requireAdmin } from "@/lib/admin";
import { lusakaDate } from "@/lib/service";

async function Overview() {
  await requireAdmin();
  const cards: { href: string; label: string; value: string | number; note: string; urgent?: boolean }[] = [];

  if (dbConnected()) {
    const db = adminDb();
    const now = new Date().toISOString();
    const [overdue, newPeople, prayers, today] = await Promise.all([
      db.from("followups").select("person_id", { count: "exact", head: true }).eq("stage", "new").lt("due_at", now),
      db.from("followups").select("person_id", { count: "exact", head: true }).eq("stage", "new"),
      db.from("prayer_requests").select("id", { count: "exact", head: true }).in("status", ["open", "praying"]),
      db.from("attendance_summary").select("total_people").eq("service_date", lusakaDate()),
    ]);
    const present = (today.data ?? []).reduce((n, r: { total_people: number }) => n + r.total_people, 0);
    cards.push(
      { href: "/admin/people?stage=new", label: "Waiting for follow-up", value: newPeople.count ?? 0, note: `${overdue.count ?? 0} overdue (over 24h)`, urgent: (overdue.count ?? 0) > 0 },
      { href: "/admin/prayer", label: "Open prayer requests", value: prayers.count ?? 0, note: "Pray and update status" },
      { href: "/admin/attendance", label: "People at church today", value: present, note: "From QR check-in" },
    );
  }

  const links = [
    ["/admin/details", "Church details", "Service time, venue, pastor, WhatsApp, cell groups"],
    ["/admin/sermons", "Sermons", "Add a new message or video link"],
    ["/admin/devotionals", "Devotionals", "Edit and approve the daily devotionals"],
    ["/admin/people", "People & follow-up", "Visitors, salvation responses, follow-up notes"],
  ];

  return (
    <>
      <DbNotice />
      {cards.length > 0 && (
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className={`card lift block ${c.urgent ? "border-flame" : ""}`}>
              <p className="text-sm text-muted">{c.label}</p>
              <p className="text-street mt-2 text-5xl tabular-nums">{c.value}</p>
              <p className={`mt-2 text-sm ${c.urgent ? "font-semibold text-flame-red" : "text-muted"}`}>{c.note}</p>
            </Link>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map(([href, title, body]) => (
          <Link key={href} href={href} className="card lift block">
            <p className="text-h4">{title}</p>
            <p className="mt-1 text-sm text-muted">{body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminHeader title="Welcome back" intro="Manage Living Temples Church’s website and follow-up." />
      <Suspense fallback={<Skeleton />}>
        <Overview />
      </Suspense>
    </div>
  );
}
