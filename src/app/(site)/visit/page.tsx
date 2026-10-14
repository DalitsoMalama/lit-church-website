import type { Metadata } from "next";
import { VisitForm } from "@/components/IntakeForms";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: "Plan a Visit",
    description: `Join Living Temples Church every ${site.service.day} at ${site.service.time}, ${site.service.venue}, ${site.service.address}.`,
  };
}

const whatToExpect = (leadPastor: string) => [
  { title: "Spirit-filled worship", body: "Joyful praise and worship. Come as you are, there is no dress code." },
  { title: "The Word", body: `A practical, Bible-based message from ${leadPastor} or one of our elders.` },
  { title: "Prayer ministry", body: "Our team is ready to pray with you for salvation, healing, the Holy Spirit and every need." },
  { title: "A warm welcome", body: "Our welcome team will meet you at the door and help you find a seat." },
];

export default async function VisitPage() {
  const site = await getSite();
  const expect = whatToExpect(site.leadPastor);
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2">
      <div className="space-y-8">
        <header data-reveal className="space-y-5">
          <p className="eyebrow">Plan a visit</p>
          <h1 className="text-h1">We saved you a seat.</h1>
          <p className="text-lead measure">
            Every {site.service.day} at <strong className="text-foreground">{site.service.time}</strong>
            <br />
            {site.service.venue}, {site.service.address}
          </p>
          <a href={site.service.mapUrl} className="btn-outline" target="_blank" rel="noopener">
            Get directions in Google Maps
          </a>
        </header>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
          {/* Fallback shown until (or if) the Google map loads */}
          <a
            href={site.service.mapUrl}
            target="_blank"
            rel="noopener"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center"
          >
            <span className="text-street-label text-flame">{site.service.venue}</span>
            <span className="font-display text-xl">{site.service.address}</span>
            <span className="text-sm text-muted underline">Open in Google Maps</span>
          </a>
          <iframe
            src={site.service.mapEmbed}
            title="Map to Havemore Restaurant, Parklands, Kitwe"
            loading="lazy"
            className="relative h-full w-full"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <section>
          <h2 className="mb-4 text-h3">What to expect</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {expect.map((e) => (
              <li key={e.title} data-reveal className="card lift p-5">
                <p className="font-semibold">{e.title}</p>
                <p className="mt-1 text-sm text-muted">{e.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="lg:sticky lg:top-24 lg:self-start">
        <div className="card">
          <h2 className="mb-1 text-h3">Let us know you’re coming</h2>
          <p className="mb-6 text-sm text-muted">We’ll message you on WhatsApp to welcome you.</p>
          <VisitForm />
        </div>
      </section>
    </div>
  );
}
