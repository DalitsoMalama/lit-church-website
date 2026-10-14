import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SermonForm } from "@/components/admin/forms";
import { ConfirmSubmit } from "@/components/admin/ui";
import { AdminHeader, DbNotice, Skeleton } from "@/components/admin/page";
import { adminDb, requireAdmin } from "@/lib/admin";
import { deleteSermon, saveSermon } from "../../../actions";

export const metadata = { title: "Edit sermon" };

async function EditSermon({ params }: { params: PageProps<"/admin/sermons/[id]">["params"] }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: s } = await adminDb().from("sermons").select("*").eq("id", id).maybeSingle();
  if (!s) notFound();
  return (
    <>
      <DbNotice />
      <SermonForm
        action={saveSermon.bind(null, id)}
        initial={{
          title: s.title,
          series: s.series ?? "",
          speaker: s.speaker,
          preachedOn: s.preached_on,
          scripture: s.scripture ?? "",
          summary: s.summary ?? "",
          videoUrl: s.video_url ?? "",
          audioUrl: s.audio_url ?? "",
          published: s.published,
        }}
      />
      <form action={deleteSermon.bind(null, id)} className="mt-8 flex items-center gap-4 rounded-2xl border border-flame-red/30 p-4">
        <p className="flex-1 text-sm text-muted">Delete this sermon from the website permanently.</p>
        <ConfirmSubmit
          label="Delete sermon"
          question={`Delete “${s.title}”? This can’t be undone.`}
          className="btn border border-flame-red text-flame-red hover:bg-flame-red hover:text-white"
        />
      </form>
    </>
  );
}

export default function EditSermonPage({ params }: PageProps<"/admin/sermons/[id]">) {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader title="Edit sermon" actions={<Link href="/admin/sermons" className="btn-outline">Back</Link>} />
      <Suspense fallback={<Skeleton />}>
        <EditSermon params={params} />
      </Suspense>
    </div>
  );
}
