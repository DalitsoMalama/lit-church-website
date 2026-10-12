// Placeholder mark until the vector logo arrives: a living flame over the "lit" wordmark.
export function Logo({ className = "", withName = true }: { className?: string; withName?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 40" className="h-9 w-auto overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f2b01e" />
            <stop offset="0.55" stopColor="#e8601a" />
            <stop offset="1" stopColor="#c8231b" />
          </linearGradient>
        </defs>
        <g className="flicker">
          <path
            d="M16 2c2 6 9 9 9 18a9 9 0 0 1-18 0c0-5 3-8 5-10 0 3 1 5 3 6-1-5 0-10 1-14z"
            fill="url(#flame)"
          />
        </g>
        <rect x="14.5" y="30" width="3" height="9" rx="1.5" fill="currentColor" />
      </svg>
      {withName && (
        <span className="leading-none">
          <span className="block font-display text-[1.45rem] font-semibold tracking-[-0.03em]">lit</span>
          <span className="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.28em] opacity-60">
            church
          </span>
        </span>
      )}
    </span>
  );
}
