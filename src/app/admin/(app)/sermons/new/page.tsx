import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { SermonForm } from "@/components/admin/forms";
import { AdminHeader, DbNotice, Skeleton } from "@/components/admin/page";
import { requireAdmin } from "@/lib/admin";
import { getSite } from "@/lib/content";
import { lusakaDate } from "@/lib/service";
import { saveSermon } from "../../../actions";

export const metadata = { title: "Add sermon" };

async function NewSermon() {
  await requireAdmin();
  await connection();
  const site = await getSite();
  return (
    <>
      <DbNotice />
      <SermonForm
        action={saveSermon.bind(null, null)}
        initial={{ title: "", series: "", speaker: site.leadPastor, preachedOn: lusakaDate(), scripture: "", summary: "", videoUrl: "", audioUrl: "", published: true }}
      />
    </>
  );
}

export default function NewSermonPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader title="Add sermon" actions={<Link href="/admin/sermons" className="btn-outline">Back</Link>} />
      <Suspense fallback={<Skeleton />}>
        <NewSermon />
      </Suspense>
    </div>
  );
}
