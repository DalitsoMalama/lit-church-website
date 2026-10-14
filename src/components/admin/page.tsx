import type { ReactNode } from "react";
import { dbConnected } from "@/lib/admin";

/** Standard admin page header. */
export function AdminHeader({ title, intro, actions }: { title: string; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-h2">{title}</h1>
        {intro && <p className="mt-2 text-muted">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

/** Shown when the site isn't connected to a database yet. */
export function DbNotice() {
  if (dbConnected()) return null;
  return (
    <div role="alert" className="mb-8 rounded-2xl border border-flame-gold/40 bg-flame-gold/10 p-4 text-sm">
      <strong>The database isn’t connected.</strong> Changes can’t be saved until <code>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
      and <code>SUPABASE_SERVICE_ROLE_KEY</code> are set. On this computer, run <code>npm run db:start</code>.
    </div>
  );
}

export const Skeleton = () => <div className="card h-64 animate-pulse" />;

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-ZM", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lusaka" }).format(new Date(iso));

export const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-ZM", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lusaka" }).format(new Date(iso));
