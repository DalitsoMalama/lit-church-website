import Link from "next/link";
import { Suspense } from "react";
import { EVENT_LABELS, SOURCE_LABELS, STAGES } from "@/components/admin/labels";
import { AdminHeader, DbNotice, fmtDate, Skeleton } from "@/components/admin/page";
import { adminDb, dbConnected, requireAdmin } from "@/lib/admin";

export const metadata = { title: "People & follow-up" };

type Row = {
  id: string;
  name: string;
  area: string | null;
  source: string;
  referral_code: string | null;
  created_at: string;
  followups: { stage: string; due_at: string; last_contact_at: string | null } | null;
  journey_events: { type: string; created_at: string }[];
};

/** New people should be contacted within 24 hours of signing up. */
const isOverdue = (f: Row["followups"]) => f?.stage === "new" && Date.parse(f.due_at) < Date.now();

async function List({ searchParams }: { searchParams: PageProps<"/admin/people">["searchParams"] }) {
  await requireAdmin();
  const stage = (await searchParams).stage;
  const filter = typeof stage === "string" && STAGES.some(([v]) => v === stage) ? stage : null;
  let rows: Row[] = [];
  if (dbConnected()) {
    let q = adminDb()
      .from("people")
      .select(
        `id,name,area,source,referral_code,created_at,followups${filter ? "!inner" : ""}(stage,due_at,last_contact_at),journey_events(type,created_at)`,
      )
      .order("created_at", { ascending: false })
      .limit(300);
    if (filter) q = q.eq("followups.stage", filter);
    rows = ((await q).data ?? []) as unknown as Row[];
  }

  return (
    <>
      <DbNotice />
      <nav aria-label="Filter by stage" className="mb-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/people"
          className={`rounded-full border px-3 py-1.5 ${!filter ? "border-flame bg-flame text-white" : "border-border"}`}
        >
          Everyone
        </Link>
        {STAGES.map(([v, l]) => (
          <Link
            key={v}
            href={`/admin/people?stage=${v}`}
            className={`rounded-full border px-3 py-1.5 ${filter === v ? "border-flame bg-flame text-white" : "border-border"}`}
          >
            {l}
          </Link>
        ))}
      </nav>
      <ul className="divide-y divide-border rounded-3xl border border-border bg-surface">
        {rows.length === 0 && <li className="p-8 text-center text-muted">Nobody here yet.</li>}
        {rows.map((p) => {
          const latest = [...p.journey_events].sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
          const f = p.followups;
          const overdue = isOverdue(f);
          const stageLabel = STAGES.find(([v]) => v === f?.stage)?.[1] ?? "New";
          return (
            <li key={p.id}>
              <Link href={`/admin/people/${p.id}`} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-4 hover:bg-background">
                <span className="min-w-48 flex-1">
                  <span className="font-semibold">{p.name}</span>
                  <span className="block text-sm text-muted">
                    {[latest && EVENT_LABELS[latest.type], SOURCE_LABELS[p.source], p.area, p.referral_code && `ref ${p.referral_code}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <span className="text-sm text-muted">{fmtDate(p.created_at)}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    overdue ? "bg-flame-red text-white" : f?.stage === "new" ? "bg-flame-gold/20" : "bg-border"
                  }`}
                >
                  {overdue ? "Overdue" : stageLabel}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function PeopleAdmin({ searchParams }: PageProps<"/admin/people">) {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminHeader
        title="People & follow-up"
        intro="Everyone who planned a visit, responded on Know Jesus or checked in for the first time. Contact new people within 24 hours."
      />
      <Suspense fallback={<Skeleton />}>
        <List searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
