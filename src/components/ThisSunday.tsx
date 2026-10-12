"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { formatServiceDate, formatServiceDateLong, nextService, serviceLabel } from "@/lib/service";
import { site, whatsappShare } from "@/lib/site";
import { WhatsApp } from "./icons";
import { Ribbon } from "./street";

// A ticking clock shared by every subscriber; null on the server (renders the static fallback).
const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
};
const getNow = () => Math.floor(Date.now() / 1000);
const getServerNow = () => null;

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    [Math.floor(s / 86400), "days"],
    [Math.floor((s % 86400) / 3600), "hrs"],
    [Math.floor((s % 3600) / 60), "min"],
    [s % 60, "sec"],
  ] as const;
}

/** The "This Sunday" signboard: next service date, live countdown, calendar + WhatsApp invite. */
export function ThisSunday() {
  const nowSec = useSyncExternalStore(subscribe, getNow, getServerNow);
  const now = nowSec === null ? null : new Date(nowSec * 1000);
  const service = now ? nextService(now) : null;

  const invite = service
    ? `Join me at ${site.name} on ${formatServiceDateLong(service.start)} at ${site.service.time}, ${site.service.venue}, ${site.service.address}. Come as you are! ${site.url}/visit`
    : `Join me at ${site.name} this ${site.service.day} at ${site.service.time}, ${site.service.venue}. Come as you are! ${site.url}/visit`;

  return (
    <div
      className="relative w-full max-w-md rounded-[6px] border-[6px] border-white/90 bg-lit-green p-6 text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] sm:p-8 lg:rotate-[-2deg]"
      aria-live="polite"
    >
      <Ribbon>{service && now ? serviceLabel(service, now) : `This ${site.service.day}`}</Ribbon>

      <p className="text-street mt-6 text-5xl whitespace-nowrap text-flyer-yellow sm:text-6xl">
        {service ? formatServiceDate(service.start) : `Every ${site.service.day}`}
      </p>
      <p className="text-street-md mt-2">{site.service.time}</p>
      <p className="mt-3 font-medium text-white/90">{site.service.venue}</p>
      <p className="text-sm text-white/70">{site.service.address}</p>

      {service?.live ? (
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-black/20 px-4 py-3">
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-flyer-yellow opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-flyer-yellow" />
          </span>
          <span className="font-medium">Service in progress. Welcome!</span>
        </div>
      ) : (
        <dl className="mt-6 grid grid-cols-4 gap-2" aria-label="Time until the service starts">
          {(service && now ? parts(service.start.getTime() - now.getTime()) : parts(0)).map(([n, label]) => (
            <div key={label} className="flex flex-col-reverse rounded-lg bg-black/20 px-1 py-2 text-center">
              <dt className="text-street-label mt-1 text-[0.625rem] text-white/60">{label}</dt>
              <dd className="text-street text-3xl tabular-nums">{service ? String(n).padStart(2, "0") : "--"}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {service?.live ? (
          <Link href="/checkin" className="btn bg-flyer-yellow text-charcoal hover:-translate-y-0.5">
            Check in
          </Link>
        ) : (
          <a href="/calendar" className="btn bg-white text-lit-green hover:-translate-y-0.5 hover:bg-flyer-yellow hover:text-charcoal">
            Add to calendar
          </a>
        )}
        <a
          href={whatsappShare(invite)}
          target="_blank"
          rel="noopener"
          className="btn border border-white/40 text-white hover:-translate-y-0.5 hover:border-white"
        >
          <WhatsApp /> Invite a friend
        </a>
      </div>
    </div>
  );
}
