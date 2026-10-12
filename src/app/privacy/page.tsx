import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Notice" };

// DRAFT, to be reviewed against the Data Protection Act No. 3 of 2021 by a Zambian lawyer before launch.
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-5 py-16 sm:py-24 [&_h2]:text-h4 [&_h2]:pt-4">
      <h1 className="text-h1">Privacy Notice</h1>
      <p className="rounded-xl bg-flame-gold/15 p-4 text-sm">Draft, pending legal review.</p>
      <p>
        {site.name} (&quot;LIT&quot;), {site.city}, respects your privacy and processes personal data in line with
        the Data Protection Act No. 3 of 2021 of Zambia.
      </p>
      <h2>What we collect</h2>
      <p>
        Only what you give us in our forms: your name, phone/WhatsApp number, area, preferred language, and what
        you share with us (such as a visit plan, a faith decision or a prayer request).
      </p>
      <h2>Why we use it</h2>
      <p>
        To welcome you, follow up on your request, pray for you, and invite you to church activities. We do not
        sell or share your data with advertisers.
      </p>
      <h2>Who can see it</h2>
      <p>
        Only the LIT team members responsible for your request (welcome, follow-up and prayer teams, Elders and
        the Reverend). Private prayer requests are seen only by the Reverend and Elders.
      </p>
      <h2>Where it is stored</h2>
      <p>
        On secure cloud servers (Supabase and Vercel), which may be located outside Zambia. By giving consent you
        agree to this transfer. Data is encrypted in transit.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your data, or withdraw consent, at any time.{" "}
        <a href={whatsappLink("Hello LIT Church, I have a request about my personal data.")} className="underline">
          Contact us on WhatsApp
        </a>
        .
      </p>
    </article>
  );
}
