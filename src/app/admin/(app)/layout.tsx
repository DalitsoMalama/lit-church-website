import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { signOut } from "../actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | LIT Church" },
  robots: { index: false, follow: false },
};

const nav = [
  ["/admin", "Dashboard"],
  ["/admin/details", "Church details"],
  ["/admin/sermons", "Sermons"],
  ["/admin/devotionals", "Devotionals"],
  ["/admin/people", "People & follow-up"],
  ["/admin/prayer", "Prayer requests"],
  ["/admin/attendance", "Attendance"],
] as const;

// Admin shell. Every page inside checks the admin session itself (requireAdmin).
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="border-b border-border bg-charcoal text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo className="text-white" />
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-semibold tracking-widest uppercase">Admin</span>
          </Link>
          <Link href="/" className="text-sm text-white/60 hover:text-white lg:mt-6 lg:inline-block">
            View website ↗
          </Link>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:px-3 lg:pb-0">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="block shrink-0 rounded-xl px-3 py-2 text-sm whitespace-nowrap text-white/80 hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="px-5 pb-3 lg:px-6 lg:py-6">
          <button type="submit" className="text-sm text-white/60 hover:text-white">
            Sign out
          </button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-10 sm:py-10">{children}</main>
    </div>
  );
}
