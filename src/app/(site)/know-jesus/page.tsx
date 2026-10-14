import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ResponseForm } from "@/components/IntakeForms";
import { PrayerMoment, RespondBar, ScarletToSnow } from "@/components/KnowJesusStory";
import { WhatsApp } from "@/components/icons";
import { Ribbon, Signboard } from "@/components/street";
import { gospelSteps, salvationPrayer } from "@/content/gospel";
import { bibleUrl } from "@/lib/bible";
import { site, whatsappShare } from "@/lib/site";

export const metadata: Metadata = {
  title: "Know Jesus",
  description:
    "Come as you are. Seven truths that can change your life: Jesus died, rose again and pours out His Holy Spirit on all who believe.",
};

// Board colours per chapter: green on scarlet, white for "white as snow", red for the fire of the Spirit
const tones = ["green", "green", "white", "green", "green", "red", "green"] as const;
const d = (n: number) => ({ "--d": n }) as CSSProperties;

export default function KnowJesusPage() {
  return (
    <>
      <RespondBar />

      <ScarletToSnow chapters={gospelSteps.map((s) => s.title)}>
        {/* ── Intro ─────────────────────────────────────────── */}
        <section id="intro" className="flex min-h-[88svh] flex-col items-center justify-center px-5 py-24 text-center">
          <div className="enter" style={d(0)}>
            <Ribbon>Isaiah 1:18</Ribbon>
          </div>
          <h1 className="enter text-street-xl mt-8" style={d(1)}>
            Come as
            <br />
            you <span className="text-flyer-yellow">are.</span>
          </h1>
          <p className="enter mt-8 font-display text-2xl italic text-[color:var(--ink-muted)] sm:text-3xl" style={d(2)}>
            Seven truths. A few minutes. A new life.
          </p>
          <a
            href="#chapter-1"
            className="enter group mt-12 inline-flex flex-col items-center gap-3 text-street-label"
            style={d(3)}
          >
            Begin
            <span className="flex h-10 w-6 justify-center rounded-full border border-current pt-2 opacity-70">
              <span className="scroll-cue block h-2 w-0.5 rounded-full bg-current" />
            </span>
          </a>
        </section>

        {/* ── Seven chapters ────────────────────────────────── */}
        {gospelSteps.map((step, i) => (
          <section
            key={step.title}
            id={`chapter-${i + 1}`}
            data-chapter
            data-wash={i === 2 ? "" : undefined}
            className="flex min-h-[100svh] scroll-mt-16 items-center px-5 py-24"
          >
            <div className="mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-[1.15fr_0.85fr] md:gap-20">
              <div className={i % 2 ? "md:order-2" : undefined}>
                <p aria-hidden className="text-street text-[5.5rem] leading-none opacity-15 sm:text-[8rem]">
                  0{i + 1}
                </p>
                <p className="text-street-label mt-2 text-[color:var(--ink-muted)]">Truth {i + 1} of 7</p>
                <h2 data-reveal className="text-h1 mt-5">
                  {step.title}
                </h2>
                <p data-reveal className="measure mt-6 text-xl leading-relaxed text-[color:var(--ink-muted)]">
                  {step.body}
                </p>
                <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {step.refs.map((r) => (
                    <a
                      key={r}
                      href={bibleUrl(r)}
                      target="_blank"
                      rel="noopener"
                      className="underline decoration-current/40 underline-offset-4 hover:decoration-current"
                    >
                      {r}
                    </a>
                  ))}
                </p>
              </div>
              <div className="flex justify-center">
                <Signboard text={step.sign.text} reference={step.sign.ref} tone={tones[i]} tilt={i % 2 ? 2.5 : -2.5} />
              </div>
            </div>
          </section>
        ))}
      </ScarletToSnow>

      {/* ── The prayer ─────────────────────────────────────── */}
      <section className="light-scope bg-snow px-5 py-28 sm:py-36">
        <PrayerMoment prayer={salvationPrayer} />
      </section>

      {/* ── Response ───────────────────────────────────────── */}
      <section id="respond" className="scroll-mt-20 px-5 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-street-lg">
            Tell us. <span className="text-flame">We’ll walk with you.</span>
          </h2>
          <p className="text-lead measure mt-6">
            Someone from LIT will message you on WhatsApp within 24 hours to pray with you, answer your questions
            and help you take your next step: water baptism and the baptism of the Holy Spirit.
          </p>
          <div className="card mt-10">
            <ResponseForm />
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
            <p className="text-muted">Know someone who needs to hear this?</p>
            <a
              href={whatsappShare(`Come as you are. Seven truths that can change your life: ${site.url}/know-jesus`)}
              className="btn-green"
              target="_blank"
              rel="noopener"
            >
              <WhatsApp /> Share on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
