import type { Metadata } from "next";
import Image from "next/image";
import { currentSeries, sermons, youtubeEmbed } from "@/content/sermons";
import { whatsappLink, whatsappShare, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Watch and listen to messages from Reverend Mwamba and Living Temples Church, Kitwe.",
};

const fmt = (d: string) =>
  new Intl.DateTimeFormat("en-ZM", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${d}T00:00:00Z`),
  );

export default function SermonsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-5 py-16 sm:py-24">
      <header data-reveal className="grid items-center gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <p className="eyebrow">Sermons</p>
          <h1 className="text-h1">{currentSeries.title}</h1>
          <p className="text-lead measure">{currentSeries.description}</p>
          <p className="rounded-xl bg-flame-gold/15 p-4 text-sm">
            <strong>Live streaming is coming soon.</strong> Until then, short sermon clips will be posted here and
            in our WhatsApp community. Join us in person every {site.service.day} at {site.service.time}.
          </p>
        </div>
        <Image
          src={currentSeries.image}
          alt={`${currentSeries.title} flyer`}
          width={864}
          height={1080}
          className="rounded-2xl"
        />
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {sermons.map((s) => {
          const embed = youtubeEmbed(s.videoUrl);
          return (
            <article key={s.slug} data-reveal className="card lift space-y-4">
              {embed ? (
                <div className="aspect-video overflow-hidden rounded-xl">
                  <iframe
                    src={embed}
                    title={s.title}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl bg-charcoal text-sm text-white/70">
                  Video coming soon
                </div>
              )}
              {s.audioUrl && <audio controls preload="none" src={s.audioUrl} className="w-full" />}
              <div>
                <p className="eyebrow">{s.series}</p>
                <h2 className="text-h4">{s.title}</h2>
                <p className="text-sm text-muted">
                  {s.speaker} · {fmt(s.date)}
                  {s.scripture && ` · ${s.scripture}`}
                </p>
                {s.summary && <p className="mt-2">{s.summary}</p>}
              </div>
              <div className="flex flex-wrap gap-3">
                {s.videoUrl && !embed && (
                  <a href={s.videoUrl} className="btn-primary" target="_blank" rel="noopener">
                    Watch
                  </a>
                )}
                <a
                  href={whatsappShare(`${s.title} by ${s.speaker}, ${site.shortName}\n${site.url}/sermons`)}
                  className="btn-green"
                  target="_blank"
                  rel="noopener"
                >
                  Share on WhatsApp
                </a>
              </div>
            </article>
          );
        })}
      </section>

      <p className="text-center text-sm text-muted">
        Missed a message?{" "}
        <a href={whatsappLink("Hello LIT Church, could you send me the latest sermon?")} className="underline">
          Ask us on WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
