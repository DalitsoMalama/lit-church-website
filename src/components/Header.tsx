import Link from "next/link";
import type { CSSProperties } from "react";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { InstallButton } from "./InstallApp";
import { ThemeToggle } from "./ThemeToggle";
import { WhatsApp } from "./icons";
import { whatsappLink, type SiteInfo } from "@/lib/site";

type NavItem = { href: string; label: string; note?: string };

export const primaryNav: NavItem[] = [
  { href: "/visit", label: "Visit" },
  { href: "/know-jesus", label: "Know Jesus" },
  { href: "/sermons", label: "Watch" },
];

export const growNav: NavItem[] = [
  { href: "/devotional", label: "Devotional", note: "A word for every day" },
  { href: "/groups", label: "Cell Groups", note: "Chimwemwe · Riverside · Ndeke · Buchi" },
  { href: "/prayer", label: "Prayer", note: "We will pray with you" },
];

/** Flat list for the footer and phone menu. */
export const nav: NavItem[] = [...primaryNav, ...growNav, { href: "/about", label: "About" }];

const linkCls =
  "relative py-1 text-foreground/80 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-flame after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100";

export function Header({ site }: { site: SiteInfo }) {
  return (
    <header className="site-header sticky print:hidden top-0 z-40 border-b border-transparent bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" aria-label="LIT Church home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 text-[0.9375rem] font-medium lg:flex">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={linkCls}>
              {item.label}
            </Link>
          ))}

          {/* "Grow" dropdown: opens on hover and on keyboard focus */}
          <div className="group relative">
            <button type="button" className={`${linkCls} inline-flex items-center gap-1`} aria-haspopup="true">
              Grow
              <svg
                viewBox="0 0 12 12"
                className="size-3 transition-transform duration-300 group-focus-within:rotate-180 group-hover:rotate-180"
                aria-hidden="true"
              >
                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <div className="invisible absolute top-full left-1/2 w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="rounded-3xl border border-border bg-surface p-2 shadow-2xl">
                {growNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-2xl px-4 py-3 hover:bg-background">
                      <span className="block font-display text-lg">{item.label}</span>
                      <span className="block text-xs text-muted">{item.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link href="/about" className={linkCls}>
            About
          </Link>
          <InstallButton />
          <ThemeToggle />
          <Link href="/give" className="btn-primary px-5 py-2.5">
            Give
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <InstallButton />
          <ThemeToggle />
          {/* Full-screen phone menu: <details> works even before JavaScript loads */}
          <MobileMenu className="group">
            <summary className="btn-outline relative z-50 cursor-pointer list-none px-4 py-2 [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Menu</span>
              <span className="hidden group-open:inline">Close</span>
            </summary>
            <div className="fixed inset-x-0 top-[4.25rem] bottom-0 z-40 overflow-y-auto bg-background px-5 pt-6 pb-10">
              <ul className="space-y-1">
                {[...nav, { href: "/give", label: "Give" }].map((item, i) => (
                  <li key={item.href} className="enter" style={{ "--d": i * 0.4 } as CSSProperties}>
                    <Link href={item.href} className="block border-b border-border py-3 font-display text-3xl">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <InstallButton variant="block" />
              </div>
              <div className="mt-4 space-y-4 rounded-3xl bg-charcoal p-6 text-white">
                <p className="text-street-label text-flyer-yellow">Every {site.service.day}</p>
                <p className="text-street-md">{site.service.time}</p>
                <p className="text-sm text-white/70">
                  {site.service.venue}, {site.service.address}
                </p>
                <a href={whatsappLink(site, "Hello LIT Church!")} className="btn-green w-full">
                  <WhatsApp /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
