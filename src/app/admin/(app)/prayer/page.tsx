import { Suspense } from "react";
import { PrayerStatusForm } from "@/components/admin/forms";
import { PRAYER_CATEGORIES } from "@/components/admin/labels";
import { AdminHeader, DbNotice, fmtDateTime, Skeleton } from "@/components/admin/page";
import { adminDb, dbConnected, requireAdmin } from "@/lib/admin";
import { updatePrayer } from "../../actions";

export const metadata = { title: "Prayer requests" };

type Row = {
  id: string;
  name: string | null;
  phone: string | null;
  category: string;
  body: string;
  visibility: string;
  status: string;
  testimony: string | null;
  created_at: string;
};

const ORDER: Record<string, number> = { open: 0, praying: 1, answered: 2, archived: 3 };

async function List() {
  await requireAdmin();
  const rows: Row[] = dbConnected()
    ? ((await adminDb().from("prayer_requests").select("*").order("created_at", { ascending: false }).limit(200)).data ?? [])
    : [];
  rows.sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9));

  return (
    <>
      <DbNotice />
      <ul className="space-y-4">
        {rows.length === 0 && <li className="card text-center text-muted">No prayer requests yet.</li>}
        {rows.map((r) => (
          <li key={r.id} className={`card ${r.status === "archived" ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-flame/10 px-2.5 py-1 text-flame">{PRAYER_CATEGORIES[r.category] ?? r.category}</span>
              {r.visibility === "private" && (
                <span className="rounded-full bg-charcoal px-2.5 py-1 text-white">Private: Reverend &amp; Elders only</span>
              )}
              <span className="ml-auto font-normal text-muted">{fmtDateTime(r.created_at)}</span>
            </div>
            <p className="mt-3 whitespace-pre-line">{r.body}</p>
            <p className="mt-2 text-sm text-muted">
              {r.name || "Anonymous"}
              {r.phone && <> · {r.phone}</>}
            </p>
            <PrayerStatusForm action={updatePrayer.bind(null, r.id)} status={r.status} testimony={r.testimony ?? ""} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default function PrayerAdmin() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader title="Prayer requests" intro="Requests from the Prayer page. Private ones are for the Reverend and Elders only." />
      <Suspense fallback={<Skeleton />}>
        <List />
      </Suspense>
    </div>
  );
}
