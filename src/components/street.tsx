// The "Street" voice: components drawn from LIT's own street-evangelism signs and flyers.
import type { CSSProperties, ReactNode } from "react";

const flamePath = "M16 2c2 6 9 9 9 18a9 9 0 0 1-18 0c0-5 3-8 5-10 0 3 1 5 3 6-1-5 0-10 1-14z";

/**
 * Scripture shown like the physical LIT street signs: a coloured board,
 * the church mark at the top, bold capitals, and the reference on a white strip.
 */
export function Signboard({
  text,
  reference,
  tone = "green",
  tilt = 0,
  swing = true,
  className = "",
}: {
  text: string;
  reference: string;
  tone?: "green" | "white" | "red";
  tilt?: number; // degrees; signs look hand-held when slightly tilted
  swing?: boolean;
  className?: string;
}) {
  const board = {
    green: "bg-lit-green text-white border-white/90",
    white: "bg-white text-charcoal border-charcoal/10",
    red: "bg-ribbon text-white border-white/90",
  }[tone];
  const words = text.split(" ");
  const accent = tone === "white" ? "text-lit-green" : "text-flyer-yellow";

  return (
    <figure
      className={`${swing ? "swing-in" : ""} relative w-full max-w-sm rounded-[6px] border-[6px] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] sm:p-6 ${board} ${className}`}
      style={{ "--tilt": `${tilt}deg`, transform: `rotate(${tilt}deg)` } as CSSProperties}
    >
      <div className="flex items-center gap-2 text-street-label">
        <svg viewBox="0 0 32 40" className="h-5 w-auto" aria-hidden="true">
          <path d={flamePath} fill={tone === "white" ? "var(--flame)" : "var(--flyer-yellow)"} />
        </svg>
        Living Temples Church
      </div>
      <blockquote className="mt-4 text-street-md">
        {words.map((w, i) => (
          <span key={i} className={i === words.length - 1 ? accent : undefined}>
            {w}
            {i < words.length - 1 && " "}
          </span>
        ))}
      </blockquote>
      <figcaption
        className={`mt-5 inline-block rounded-sm px-3 py-1.5 text-street-label ${tone === "white" ? "bg-charcoal text-white" : "bg-white text-charcoal"}`}
      >
        {reference}
      </figcaption>
    </figure>
  );
}

/** The red ribbon banner from the Sunday flyers. */
export function Ribbon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block -skew-x-6 bg-ribbon px-6 py-2 text-street-label text-white shadow-[4px_4px_0_rgba(0,0,0,0.25)] [clip-path:polygon(0_0,100%_0,calc(100%-12px)_50%,100%_100%,0_100%,12px_50%)] ${className}`}
    >
      <span className="inline-block skew-x-6">{children}</span>
    </span>
  );
}

/** A small flame used as a progress / state marker instead of generic dots. */
export function FlameMarker({ lit, className = "" }: { lit: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 40"
      aria-hidden="true"
      className={`h-5 w-auto transition-all duration-500 ${lit ? "scale-110 drop-shadow-[0_0_6px_rgba(232,96,26,0.7)]" : "scale-90 opacity-50"} ${className}`}
    >
      <defs>
        <linearGradient id="fm-lit" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f2b01e" />
          <stop offset="0.55" stopColor="#e8601a" />
          <stop offset="1" stopColor="#c8231b" />
        </linearGradient>
      </defs>
      <path
        d={flamePath}
        fill={lit ? "url(#fm-lit)" : "none"}
        stroke={lit ? "none" : "currentColor"}
        strokeWidth="2"
      />
    </svg>
  );
}

export function Flame({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 40" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="flame-big" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f6c21a" />
          <stop offset="0.55" stopColor="#e8601a" />
          <stop offset="1" stopColor="#c8231b" />
        </linearGradient>
      </defs>
      <path d={flamePath} fill="url(#flame-big)" />
    </svg>
  );
}
