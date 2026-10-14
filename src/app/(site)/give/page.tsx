import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Give",
  description: "Give to Living Temples Church by Airtel Money, MTN MoMo, Zamtel Kwacha or Visa/Mastercard.",
};

const methods = ["Airtel Money", "MTN MoMo", "Zamtel Kwacha", "Visa / Mastercard"];
const funds = ["Tithe", "Offering", "Building fund", "Missions & outreach"];

export default async function GivePage() {
  const site = await getSite();
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-5 py-16 sm:py-24">
      <header data-reveal className="space-y-5">
        <p className="eyebrow">Give</p>
        <h1 className="text-h1">Partner with what God is doing.</h1>
        <p className="text-lead measure">
          “So let each one give as he purposes in his heart, not grudgingly or of necessity; for God loves a
          cheerful giver.” (2 Corinthians 9:7, NKJV)
        </p>
      </header>

      <section className="card space-y-5">
        <h2 className="text-h3">Online giving is coming soon</h2>
        <p>
          You will soon be able to give securely in kwacha, approving the payment on your phone or with your
          card:
        </p>
        <ul className="flex flex-wrap gap-2">
          {methods.map((m) => (
            <li key={m} className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              {m}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">Give towards: {funds.join(" · ")}</p>
        <a href={whatsappLink(site, "Hello LIT Church, how can I give this week?")} className="btn-green">
          Ask how to give on WhatsApp
        </a>
      </section>
    </div>
  );
}
