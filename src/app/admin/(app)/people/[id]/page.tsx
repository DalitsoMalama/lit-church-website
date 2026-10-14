import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FollowupForm } from "@/components/admin/forms";
import { EVENT_LABELS, SOURCE_LABELS } from "@/components/admin/labels";
import { AdminHeader, fmtDate, fmtDateTime, Skeleton } from "@/components/admin/page";
import { WhatsApp } from "@/components/icons";
import { adminDb, requireAdmin } from "@/lib/admin";
import { updateFollowup } from "../../../actions";

export const metadata = { title: "Person" };

type Event = { id: number; type: string; payload: Record<string, unknown>; created_at: string };

async function Person({ params }: { params: PageProps<"/admin/people/[id]">["params"] }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = adminDb();
  const [{ data: p }, { data: events }, { data: f }] = await Promise.all([
    db.from("people").select("*").eq("id", id).maybeSingle(),
    db.from("journey_events").select("id,type,payload,created_at").eq("person_id", id).order("created_at", { ascending: false }),
    db.from("followups").select("*").eq("person_id", id).maybeSingle(),
  ]);
  if (!p) notFound();
  const phoneDigits = String(p.phone ?? "").replace(/\D/g, "");
  const greeting = `Hello ${String(p.name).split(" ")[0]}, this is Living Temples Church. We’re so glad you connected with us!`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section className="card space-y-3">
          <h2 className="text-h3">{p.name}</h2>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
            <dt className="text-muted">Phone</dt>
            <dd className="tabular-nums">{p.phone}</dd>
            {p.area && (
              <>
                <dt className="text-muted">Area</dt>
                <dd>{p.area}</dd>
              </>
            )}
            <dt className="text-muted">Came through</dt>
            <dd>
              {SOURCE_LABELS[p.source] ?? p.source}
              {p.referral_code && ` (evangelist code ${p.referral_code})`}
            </dd>
            <dt className="text-muted">Language</dt>
            <dd>{p.language === "bem" ? "Ichibemba" : "English"}</dd>
            <dt className="text-muted">Consent given</dt>
            <dd>{fmtDate(p.consent_at)}</dd>
          </dl>
          {phoneDigits && (
            <a
              href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(greeting)}`}
              target="_blank"
              rel="noopener"
              className="btn-green mt-2"
            >
              <WhatsApp /> Message on WhatsApp
            </a>
          )}
        </section>

        <section>
          <h2 className="text-h4 mb-4">Journey</h2>
          <ol className="space-y-3 border-l-2 border-border pl-6">
            {((events ?? []) as Event[]).map((e) => (
              <li key={e.id} className="relative">
                <span className="absolute top-1.5 -left-[1.95rem] size-3 rounded-full bg-flame" aria-hidden />
                <p className="font-medium">{EVENT_LABELS[e.type] ?? e.type}</p>
                <p className="text-sm text-muted">{fmtDateTime(e.created_at)}</p>
                {typeof e.payload?.notes === "string" && e.payload.notes && (
                  <p className="mt-1 rounded-xl bg-background p-3 text-sm">“{e.payload.notes}”</p>
                )}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <aside className="space-y-4">
        <FollowupForm action={updateFollowup.bind(null, id)} stage={f?.stage ?? "new"} notes={f?.notes ?? ""} />
        {f && (
          <p className="text-sm text-muted">
            {f.last_contact_at ? `Last contacted ${fmtDateTime(f.last_contact_at)}.` : `First contact due ${fmtDateTime(f.due_at)}.`}
          </p>
        )}
      </aside>
    </div>
  );
}

export default function PersonPage({ params }: PageProps<"/admin/people/[id]">) {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminHeader title="Person" actions={<Link href="/admin/people" className="btn-outline">All people</Link>} />
      <Suspense fallback={<Skeleton />}>
        <Person params={params} />
      </Suspense>
    </div>
  );
}
