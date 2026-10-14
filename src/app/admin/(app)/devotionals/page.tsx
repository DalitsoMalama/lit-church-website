import Link from "next/link";
import { Suspense } from "react";
import { AdminHeader, DbNotice, Skeleton } from "@/components/admin/page";
import { series } from "@/content/devotionals";
import { requireAdmin } from "@/lib/admin";
import { getDevotionals } from "@/lib/content";

export const metadata = { title: "Devotionals" };

async function List() {
  await requireAdmin();
  const list = await getDevotionals();
  const approved = list.filter((d) => d.approved).length;
  return (
    <>
      <DbNotice />
      <p className="mb-6 text-sm">
        <strong>{approved}</strong> of {list.length} approved.{" "}
        <span className="text-muted">Drafts still show on the website, without the review badge.</span>
      </p>
      {series.weeks.map((w) => (
        <section key={w.week} className="mb-8">
          <h2 className="text-street-label mb-3 text-muted">
            Week {w.week} · {w.title} ({w.anchor})
          </h2>
          <ul className="divide-y divide-border rounded-3xl border border-border bg-surface">
            {list
              .filter((d) => d.week === w.week)
              .map((d) => (
                <li key={d.day}>
                  <Link href={`/admin/devotionals/${d.day}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-background">
                    <span className="w-14 text-sm font-semibold text-flame tabular-nums">Day {d.day}</span>
                    <span className="flex-1">
                      <span className="font-medium">{d.title}</span>
                      <span className="ml-2 text-sm text-muted">{d.scripture}</span>
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${d.approved ? "bg-lit-green/10 text-lit-green" : "bg-flame-gold/15"}`}
                    >
                      {d.approved ? "Approved" : "Draft"}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export default function DevotionalsAdmin() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader title="Devotionals" intro={`“${series.title}”: ${series.subtitle}. Edit any day, then tick “Approved”.`} />
      <Suspense fallback={<Skeleton />}>
        <List />
      </Suspense>
    </div>
  );
}
