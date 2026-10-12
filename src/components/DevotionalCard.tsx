import Link from "next/link";
import type { Devotional } from "@/content/devotionals";
import { series } from "@/content/devotionals";
import { bibleUrl } from "@/lib/bible";
import { site, whatsappShare } from "@/lib/site";
import { ArrowRight, WhatsApp } from "./icons";

// Draft badges are a review aid for the Reverend/Elders; never shown on the live site.
const showDrafts = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_DRAFTS === "true";

export function DevotionalCard({ d, full = false }: { d: Devotional; full?: boolean }) {
  const week = series.weeks[d.week - 1];
  const share = `${d.title} (${d.scripture})\n\n${d.declaration}\n\nToday’s devotional from ${site.shortName}: ${site.url}/devotional/${d.day}`;

  return (
    <article className="card space-y-8 sm:p-10">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
          <span className="rounded-full bg-flame/10 px-3 py-1 font-semibold text-flame tabular-nums">Day {d.day}</span>
          <span>
            Week {d.week} · {week.title}
          </span>
        </div>
        <h2 className="text-h2">{d.title}</h2>
        {!d.approved && showDrafts && (
          <p className="inline-block rounded-full border border-flame-gold/40 bg-flame-gold/10 px-3 py-1 text-xs font-medium">
            Draft: awaiting review by the Reverend &amp; Elders
          </p>
        )}
      </header>

      <blockquote className="relative border-l-2 border-flame pl-6">
        {d.verseText && (
          <p className="font-display text-xl leading-relaxed italic sm:text-[1.375rem]">{d.verseText}</p>
        )}
        <footer className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm ${d.verseText ? "mt-4" : ""}`}>
          <cite className="font-semibold not-italic">
            {d.scripture}
            {d.verseText && <span className="font-normal text-muted"> (NKJV)</span>}
          </cite>
          <span className="text-muted">
            Read in{" "}
            {(["NKJV", "NLT", "BEMBA"] as const).map((t, i) => (
              <span key={t}>
                {i > 0 && " · "}
                <a href={bibleUrl(d.scripture, t)} className="underline decoration-border underline-offset-4 hover:decoration-flame" target="_blank" rel="noopener">
                  {t === "BEMBA" ? "Bemba" : t}
                </a>
              </span>
            ))}
          </span>
        </footer>
      </blockquote>

      {full ? (
        <>
          <p className="measure text-lg leading-[1.75] first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-flame">
            {d.reflection}
          </p>
          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              ["Pray", d.prayer, ""],
              ["Declare", d.declaration, "font-display text-lg italic"],
              ["Do", d.action, ""],
            ].map(([label, text, cls]) => (
              <div key={label} className="rounded-2xl bg-background p-5">
                <dt className="text-xs font-semibold tracking-[0.16em] text-flame uppercase">{label}</dt>
                <dd className={`mt-2 leading-relaxed ${cls}`}>{text}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p className="line-clamp-3 text-lg leading-relaxed text-muted">{d.reflection}</p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        {!full && (
          <Link href={`/devotional/${d.day}`} className="btn-primary group">
            Read today’s devotional <ArrowRight />
          </Link>
        )}
        <a href={whatsappShare(share)} className="btn-outline" target="_blank" rel="noopener">
          <WhatsApp className="text-lit-green" /> Share
        </a>
      </div>
    </article>
  );
}
