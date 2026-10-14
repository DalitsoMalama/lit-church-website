import Image from "next/image";
import { Duotone } from "@/components/Duotone";
import { ThisSunday } from "@/components/ThisSunday";
import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import { DevotionalCard } from "@/components/DevotionalCard";
import { ArrowRight, WhatsApp } from "@/components/icons";
import { devotionalForDate } from "@/content/devotionals";
import { currentSeries } from "@/content/sermons";
import { getDevotionals, getSite } from "@/lib/content";
import { lusakaToday } from "@/lib/dates";
import { whatsappLink } from "@/lib/site";

const nextSteps = [
  { href: "/know-jesus", label: "Follow Jesus", body: "Hear the good news and begin a new life." },
  { href: "/know-jesus#respond", label: "Get baptised", body: "Take your next step of faith in water baptism." },
  { href: "/prayer", label: "Receive prayer", body: "Our prayer team is standing with you in faith." },
  { href: "/groups", label: "Find a cell group", body: "Grow with others close to home in Kitwe." },
  { href: "/about#serve", label: "Serve", body: "Use your gifts to build the house of God." },
];

const d = (n: number) => ({ "--d": n }) as CSSProperties;

async function TodaysDevotional() {
  const [today, list] = await Promise.all([lusakaToday(), getDevotionals()]);
  return <DevotionalCard d={devotionalForDate(today, list)} />;
}

export default async function Home() {
  const site = await getSite();
  return (
    <>
      {/* ── Hero: Street voice ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-charcoal text-white">
        <Duotone
          src="/images/outreach-kitwe.jpg"
          alt="LIT Church members sharing the gospel on the streets of Kitwe"
          fill
          priority
          sizes="100vw"
          className="absolute! inset-0"
          imgClassName="ken-burns object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />

        <div className="relative mx-auto grid min-h-[88svh] w-full max-w-6xl items-center gap-12 px-5 pt-16 pb-20 lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:pt-24">
          <div>
            <p className="enter text-street-label flex flex-wrap items-center gap-x-3 gap-y-1 text-flyer-yellow" style={d(0)}>
              <span lang="bem" className="font-display text-xl tracking-normal normal-case italic">
                Mwaiseni!
              </span>
              <span className="text-white/60">Welcome to Living Temples Church · Kitwe</span>
            </p>
            <h1 className="enter text-street-xl mt-6" style={d(1)}>
              Come as
              <br />
              you <span className="text-flyer-yellow">are.</span>
            </h1>
            <p className="enter mt-6 max-w-lg font-display text-xl leading-snug italic text-white/80 sm:text-2xl" style={d(2)}>
              {site.mission}
            </p>
            <div className="enter mt-10 flex flex-wrap gap-3" style={d(3)}>
              <Link href="/visit" className="btn-primary group">
                Plan your visit <ArrowRight />
              </Link>
              <Link href="/know-jesus" className="btn bg-white text-charcoal hover:-translate-y-0.5 hover:bg-flyer-yellow">
                Know Jesus
              </Link>
            </div>
          </div>

          <div className="enter flex justify-center lg:justify-end" style={d(3)}>
            <ThisSunday />
          </div>
        </div>
      </section>

      {/* ── Welcome ──────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-24 sm:py-32 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <div>
          <p data-reveal className="eyebrow">Welcome home</p>
          <h2 data-reveal className="text-h1 mt-5" style={d(1)}>
            God doesn’t live in buildings. He lives in <em className="text-flame italic">people.</em>
          </h2>
        </div>
        <div data-reveal className="space-y-6 self-end" style={d(2)}>
          <p className="text-lead">
            Living Temples Church is a Pentecostal family in Kitwe, led by {site.leadPastor}. We believe every
            believer is a temple of the Holy Spirit, set on fire to carry His presence into every home, street and
            nation.
          </p>
          <Link href="/about" className="group inline-flex items-center gap-2 font-semibold text-flame">
            Our story and beliefs <ArrowRight />
          </Link>
        </div>
      </section>

      {/* ── "I want to…" chooser ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:pb-32">
        <div data-reveal className="rounded-[2rem] border border-border bg-surface p-6 sm:p-10">
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-4">
            <span className="text-h2 mr-1">I want to</span>
            {nextSteps.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                title={s.body}
                className="group inline-flex items-center gap-2 rounded-full border-2 border-border px-5 py-2.5 font-display text-xl transition-colors hover:border-flame hover:bg-flame hover:text-white sm:text-2xl"
              >
                {s.label.toLowerCase()}
                <ArrowRight className="text-flame group-hover:text-white" />
              </Link>
            ))}
          </p>
        </div>
      </section>

      {/* ── Today's devotional ───────────────────────────────── */}
      <section className="bg-surface py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p data-reveal className="eyebrow">Daily devotional</p>
            <h2 data-reveal className="text-h1 mt-5" style={d(1)}>
              A word for <em className="italic">today.</em>
            </h2>
            <p data-reveal className="text-lead mt-6" style={d(2)}>
              Short, Spirit-filled devotionals from the Reverend and Elders: scripture, a prayer, a declaration
              and one step to take.
            </p>
            <Link data-reveal href="/devotional" className="group mt-8 inline-flex items-center gap-2 font-semibold text-flame" style={d(3)}>
              Browse all 28 days <ArrowRight />
            </Link>
          </div>
          <div data-reveal style={d(2)}>
            <Suspense fallback={<div className="card h-96 animate-pulse" />}>
              <TodaysDevotional />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ── Pull quote ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:py-32">
        <figure data-reveal="zoom">
          <span aria-hidden className="font-display text-7xl leading-none text-flame">“</span>
          <blockquote className="text-h1 -mt-4 italic">
            Though your sins are like scarlet, they shall be as white as snow.
          </blockquote>
          <figcaption className="mt-8 text-sm font-semibold tracking-[0.14em] text-muted uppercase">
            Isaiah 1:18 · NKJV
          </figcaption>
        </figure>
      </section>

      {/* ── Current series ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:pb-32">
        <div data-reveal className="group grid overflow-hidden rounded-[2rem] bg-lit-green text-white md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-center gap-6 p-8 sm:p-14">
            <p className="eyebrow text-flame-gold">Current sermon series</p>
            <h2 className="text-h1">{currentSeries.title}</h2>
            <p className="text-lg leading-relaxed text-white/80">{currentSeries.description}</p>
            <Link href="/sermons" className="btn group/btn self-start bg-white text-lit-green hover:-translate-y-0.5 hover:bg-flame-gold hover:text-charcoal">
              Explore the series <ArrowRight className="group-hover/btn:translate-x-1" />
            </Link>
          </div>
          <div className="relative min-h-80 overflow-hidden">
            <Image
              src={currentSeries.image}
              alt={`${currentSeries.title} series flyer`}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ─────────────────────────────────────── */}
      <section className="px-5">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-charcoal px-8 py-16 text-white sm:px-14">
          <div className="glow pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(242,176,30,0.35),transparent_65%)]" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div data-reveal className="max-w-xl">
              <h2 className="text-h2">Stay close through the week.</h2>
              <p className="mt-4 text-lg text-white/70">
                Daily devotionals, service updates and prayer support, right on your phone.
              </p>
            </div>
            <a
              data-reveal
              style={d(1)}
              href={site.whatsapp.communityUrl || whatsappLink(site, "Hello LIT Church, please add me to the WhatsApp community.")}
              className="btn-green shrink-0"
            >
              <WhatsApp /> Join our WhatsApp community
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
