import Link from "next/link";
import { Logo } from "./Logo";
import { nav } from "./Header";
import { WhatsApp } from "./icons";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 bg-charcoal text-white print:hidden">
      <div className="mx-auto max-w-6xl px-5 pt-20 pb-10">
        <p className="text-h1 max-w-3xl text-white/90">
          Beautifying every life and destiny by the manifestation of the <em className="text-flame-gold italic">Truth.</em>
        </p>

        <div className="mt-16 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo className="text-white" />
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              A Pentecostal church in {site.city}. Come as you are.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">Sunday service</p>
            <p className="font-display text-2xl tabular-nums">{site.service.time}</p>
            <p className="leading-relaxed text-white/70">
              {site.service.venue}
              <br />
              {site.service.address}
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a href={site.service.mapUrl} className="text-flame-gold hover:underline" target="_blank" rel="noopener">
                Get directions
              </a>
              <a
                href={whatsappLink("Hello LIT Church, I would like to know more.")}
                className="inline-flex items-center gap-2 text-flame-gold hover:underline"
              >
                <WhatsApp className="size-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">Explore</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/75">
              {[...nav, { href: "/give", label: "Give" }, { href: "/checkin", label: "Service check-in" }, { href: "/privacy", label: "Privacy" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 text-center text-xs leading-relaxed text-white/40">
        © {site.name}, {site.city}. Scripture quotations marked NKJV are taken from the New King James Version®.
        Copyright © 1982 by Thomas Nelson. Used by permission. All rights reserved.
      </div>
    </footer>
  );
}
