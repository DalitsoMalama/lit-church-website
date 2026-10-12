import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a Pentecostal church in Kitwe, Zambia. ${site.mission}`,
};

// DRAFT beliefs, to be confirmed by the Reverend & Elders.
const beliefs = [
  "The Bible is the inspired Word of God.",
  "One God, eternally existing as Father, Son and Holy Spirit.",
  "Jesus Christ died for our sins and rose bodily from the dead.",
  "Salvation is by grace through faith in Jesus, and everyone must be born again.",
  "Water baptism and the baptism of the Holy Spirit, poured out on all flesh.",
  "Divine healing and the gifts of the Spirit for today.",
  "Believers are living temples of the Holy Spirit, empowered to do the greater works Jesus promised.",
];

const serve = ["Evangelism & outreach", "Praise & worship", "Media team", "Ushering & welcome", "Children's ministry", "Prayer team"];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-5 py-16 sm:py-24">
      <header data-reveal className="space-y-5">
        <p className="eyebrow">About LIT</p>
        <h1 className="text-h1">{site.mission}</h1>
        <p className="text-lead measure">
          Living Temples Church is a Pentecostal church in {site.city}, led by {site.leadPastor}. Our name comes
          from 1 Corinthians 6:19: your body is a temple of the Holy Spirit. We believe God doesn’t live in
          buildings made with hands. He lives in people, and He sets them on fire to carry His presence into
          every home, street and nation.
        </p>
      </header>

      <section className="grid items-center gap-8 md:grid-cols-2">
        <Image
          src="/images/outreach-kitwe.jpg"
          alt="LIT Church evangelism team on the streets of Kitwe"
          width={2048}
          height={1536}
          className="rounded-2xl"
        />
        <div className="space-y-3">
          <h2 className="text-h3">A church on the streets</h2>
          <p className="text-muted">
            You’ll find us not only on Sunday mornings but on the streets of Kitwe with a simple message:
            come as you are. You must be born again. With God all things are possible.
          </p>
          <Link href="/know-jesus" className="btn-primary">
            Hear the message
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-h3">What we believe</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {beliefs.map((b) => (
            <li key={b} data-reveal className="card lift p-5">
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-h3">Leadership</h2>
        <div className="card flex items-center gap-5">
          <div className="flex size-16 items-center justify-center rounded-full bg-flame font-display text-2xl text-white">
            M
          </div>
          <div>
            <p className="text-h4">{site.leadPastor}</p>
            <p className="text-muted">Senior Pastor, supported by the Elders of LIT</p>
          </div>
        </div>
      </section>

      <section id="serve" className="scroll-mt-24 space-y-4">
        <h2 className="text-h3">Serve with us</h2>
        <ul className="flex flex-wrap gap-2">
          {serve.map((s) => (
            <li key={s} className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold">
              {s}
            </li>
          ))}
        </ul>
        <a href={whatsappLink("Hello LIT Church, I would like to serve.")} className="btn-green">
          I want to serve
        </a>
      </section>
    </div>
  );
}
