import Link from "next/link";
import { Suspense } from "react";
import { AdminHeader, DbNotice, fmtDate, Skeleton } from "@/components/admin/page";
import { adminDb, dbConnected, requireAdmin } from "@/lib/admin";

export const metadata = { title: "Sermons" };

type Row = { id: string; title: string; series: string | null; speaker: string; preached_on: string; video_url: string | null; published: boolean };

async function List({ searchParams }: { searchParams: PageProps<"/admin/sermons">["searchParams"] }) {
  await requireAdmin();
  const q = await searchParams;
  const rows: Row[] = dbConnected()
    ? ((await adminDb().from("sermons").select("id,title,series,speaker,preached_on,video_url,published").order("preached_on", { ascending: false })).data ?? [])
    : [];
  return (
    <>
      <DbNotice />
      {q.saved && <p role="status" className="mb-6 rounded-2xl bg-lit-green/10 p-4 text-sm font-medium text-lit-green">✓ Sermon saved.</p>}
      {q.deleted && <p role="status" className="mb-6 rounded-2xl bg-lit-green/10 p-4 text-sm font-medium text-lit-green">✓ Sermon deleted.</p>}
      <ul className="divide-y divide-border rounded-3xl border border-border bg-surface">
        {rows.length === 0 && <li className="p-8 text-center text-muted">No sermons yet. Add the first one.</li>}
        {rows.map((s) => (
          <li key={s.id}>
            <Link href={`/admin/sermons/${s.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-background">
              <span>
                <span className="font-semibold">{s.title}</span>
                <span className="block text-sm text-muted">
                  {[s.speaker, fmtDate(`${s.preached_on}T12:00:00Z`), s.series].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span className="flex gap-2 text-xs font-semibold">
                {!s.video_url && <span className="rounded-full bg-flame-gold/15 px-2.5 py-1">No video yet</span>}
                {!s.published && <span className="rounded-full bg-border px-2.5 py-1">Hidden</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function SermonsAdmin({ searchParams }: PageProps<"/admin/sermons">) {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader
        title="Sermons"
        intro="Messages shown on the Sermons page. Paste a YouTube link and the video plays right on the website."
        actions={
          <Link href="/admin/sermons/new" className="btn-primary">
            + Add sermon
          </Link>
        }
      />
      <Suspense fallback={<Skeleton />}>
        <List searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
