import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DevotionalForm } from "@/components/admin/forms";
import { AdminHeader, DbNotice, Skeleton } from "@/components/admin/page";
import { ConfirmSubmit } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { getDevotionalDay } from "@/lib/content";
import { resetDevotional, saveDevotional } from "../../../actions";

export const metadata = { title: "Edit devotional" };

async function Edit({ params, searchParams }: PageProps<"/admin/devotionals/[day]">) {
  await requireAdmin();
  const raw = (await params).day;
  const d = /^\d{1,3}$/.test(raw) ? await getDevotionalDay(Number(raw)) : undefined;
  if (!d) notFound();
  const reset = (await searchParams).reset;
  return (
    <>
      <DbNotice />
      {reset && <p role="status" className="mb-6 rounded-2xl bg-lit-green/10 p-4 text-sm font-medium text-lit-green">✓ Restored the original text.</p>}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-flame">Day {d.day}</span>
        <span className="flex gap-4">
          {d.day > 1 && <Link href={`/admin/devotionals/${d.day - 1}`}>← Day {d.day - 1}</Link>}
          {d.day < 28 && <Link href={`/admin/devotionals/${d.day + 1}`}>Day {d.day + 1} →</Link>}
        </span>
      </div>
      <DevotionalForm key={`${d.day}-${reset ?? ""}`} action={saveDevotional.bind(null, d.day)} initial={d} />
      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border p-4">
        <p className="flex-1 text-sm text-muted">Undo all edits to this day and go back to the original text.</p>
        <form action={resetDevotional.bind(null, d.day)}>
          <ConfirmSubmit label="Restore original" question={`Restore Day ${d.day} to its original text? Your edits will be lost.`} />
        </form>
        <Link href={`/devotional/${d.day}`} target="_blank" className="btn-outline">
          View on website ↗
        </Link>
      </div>
    </>
  );
}

export default function EditDevotionalPage(props: PageProps<"/admin/devotionals/[day]">) {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader title="Edit devotional" actions={<Link href="/admin/devotionals" className="btn-outline">All days</Link>} />
      <Suspense fallback={<Skeleton />}>
        <Edit {...props} />
      </Suspense>
    </div>
  );
}
