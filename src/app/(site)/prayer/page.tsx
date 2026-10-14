import type { Metadata } from "next";
import { PrayerForm } from "@/components/IntakeForms";
import { getSite } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prayer",
  description: "Send a prayer request to the Living Temples Church prayer team. We believe God answers prayer.",
};

export default async function PrayerPage() {
  const site = await getSite();
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 sm:py-24 md:grid-cols-[1fr_1.2fr]">
      <header data-reveal className="space-y-5">
        <p className="eyebrow">Prayer</p>
        <h1 className="text-h1">We’re standing with you in faith.</h1>
        <p className="text-lead measure">
          Whatever you are facing (sickness, family, finances, or the need for salvation and the Holy Spirit),
          our prayer team will pray for you. With God all things are possible (Matthew 19:26).
        </p>
        <a href={whatsappLink(site, "Hello LIT Church, I need someone to pray with me.")} className="btn-green">
          Pray with someone on WhatsApp
        </a>
        <p className="text-sm text-muted">
          A public prayer wall and personal prayer journal are coming soon.
        </p>
      </header>
      <div className="card">
        <PrayerForm />
      </div>
    </div>
  );
}
