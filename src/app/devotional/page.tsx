import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DevotionalCard } from "@/components/DevotionalCard";
import { devotionalForDate, devotionals, series } from "@/content/devotionals";
import { lusakaToday } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Daily Devotional",
  description: `${series.title}: ${series.subtitle}.`,
};

async function Today() {
  return <DevotionalCard d={devotionalForDate(await lusakaToday())} full />;
}

export default function DevotionalPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-5 py-16 sm:py-24">
      <header data-reveal className="space-y-5">
        <p className="eyebrow">Daily devotional</p>
        <h1 className="text-h1">{series.title}</h1>
        <p className="text-lead measure">{series.subtitle}</p>
      </header>

      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <Today />
      </Suspense>

      <section className="space-y-6">
        <h2 className="text-h3">All 28 days</h2>
        {series.weeks.map((w) => (
          <div key={w.week}>
            <h3 className="mb-3 font-semibold">
              Week {w.week}: {w.title} <span className="font-normal text-muted">({w.anchor})</span>
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {devotionals
                .filter((d) => d.week === w.week)
                .map((d) => (
                  <li key={d.day}>
                    <Link
                      href={`/devotional/${d.day}`}
                      className="flex items-baseline gap-3 rounded-xl border border-border bg-surface px-4 py-3 hover:border-flame"
                    >
                      <span className="w-12 text-xs font-semibold text-flame">Day {d.day}</span>
                      <span className="font-medium">{d.title}</span>
                      <span className="ml-auto text-xs text-muted">{d.scripture}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
