import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DevotionalCard } from "@/components/DevotionalCard";
import { devotionals } from "@/content/devotionals";
import { getDevotionalDay } from "@/lib/content";

// All 28 days are prerendered. The day is validated *before* streaming starts so an
// unknown day (e.g. /devotional/99) returns a real 404 status, not a 200 page.
// `instant = false` acknowledges that unknown days block briefly instead of streaming.
export const instant = false;

export function generateStaticParams() {
  return devotionals.map((d) => ({ day: String(d.day) }));
}

const parseDay = async (raw: string) => (/^\d{1,2}$/.test(raw) ? getDevotionalDay(Number(raw)) : undefined);

export async function generateMetadata({ params }: PageProps<"/devotional/[day]">): Promise<Metadata> {
  const d = await parseDay((await params).day);
  return d ? { title: `${d.title} (${d.scripture})`, description: d.declaration } : {};
}

export default async function DevotionalDayPage({ params }: PageProps<"/devotional/[day]">) {
  const d = await parseDay((await params).day);
  if (!d) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-5 py-16 sm:py-24">
      <DevotionalCard d={d} full />
      <nav className="flex justify-between text-sm font-semibold">
        {d.day > 1 ? <Link href={`/devotional/${d.day - 1}`}>← Day {d.day - 1}</Link> : <span />}
        <Link href="/devotional">All days</Link>
        {d.day < devotionals.length ? <Link href={`/devotional/${d.day + 1}`}>Day {d.day + 1} →</Link> : <span />}
      </nav>
    </div>
  );
}
