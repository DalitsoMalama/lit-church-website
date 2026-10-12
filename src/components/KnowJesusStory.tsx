"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Flame, FlameMarker } from "./street";

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Wraps the gospel chapters. As the reader moves through the chapter marked
 * `data-wash`, the background is washed from scarlet to snow (Isaiah 1:18).
 * Also drives the flame progress rail. Content is server-rendered; this only
 * sets CSS variables, so it works (unwashed) even before JavaScript loads.
 */
export function ScarletToSnow({ chapters, children }: { chapters: string[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const washEl = root.querySelector<HTMLElement>("[data-wash]");
      let wash = 0;
      if (washEl) {
        const r = washEl.getBoundingClientRect();
        wash = smoothstep(0.1, 0.75, (vh * 0.55 - r.top) / r.height);
      }
      root.style.setProperty("--wash", wash.toFixed(3));
      root.dataset.tone = wash > 0.5 ? "light" : "dark";

      let current = -1;
      root.querySelectorAll<HTMLElement>("[data-chapter]").forEach((el, i) => {
        if (el.getBoundingClientRect().top < vh * 0.55) current = i;
      });
      setActive(current);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="scarlet-to-snow relative">
      {/* Flame progress rail */}
      <nav
        aria-label="Chapters"
        className="pointer-events-none sticky top-[4.25rem] z-30 h-0 sm:top-[5.25rem]"
      >
        {/* Phone: a slim strip tucked under the header. Larger screens: a floating pill. */}
        <ol className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-center gap-3 bg-black/30 py-1.5 backdrop-blur-md sm:inset-x-auto sm:top-3 sm:left-1/2 sm:-translate-x-1/2 sm:gap-2.5 sm:rounded-full sm:px-4 sm:py-2">
          {chapters.map((title, i) => (
            <li key={title}>
              <a
                href={`#chapter-${i + 1}`}
                title={`${i + 1}. ${title}`}
                aria-label={`Chapter ${i + 1}: ${title}`}
                aria-current={i === active ? "step" : undefined}
                className="block p-0.5 text-white"
              >
                <FlameMarker lit={i <= active} />
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {children}
    </div>
  );
}

/** The salvation prayer, with an "I prayed" response that lights a flame and moves to the form. */
export function PrayerMoment({ prayer }: { prayer: string }) {
  const [prayed, setPrayed] = useState(false);

  const respond = (decision: string) => {
    window.dispatchEvent(new CustomEvent("lit:decision", { detail: decision }));
    document.getElementById("respond")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-street-label text-flame">Pray this prayer</p>
      <p className="mt-8 font-display text-2xl leading-snug italic sm:text-[2rem]">{prayer}</p>

      <div className="mt-12 flex min-h-40 flex-col items-center justify-center gap-6">
        {prayed ? (
          <div role="status" className="flex flex-col items-center gap-4">
            <Flame className="ignite h-28 w-auto drop-shadow-[0_0_30px_rgba(232,96,26,0.6)]" />
            <p className="enter text-street-md" style={{ "--d": 4 } as CSSProperties}>
              Welcome to the family of God!
            </p>
            <p className="enter text-muted" style={{ "--d": 6 } as CSSProperties}>
              Heaven is rejoicing over you (Luke 15:7). Tell us, so we can walk with you.
            </p>
            <button
              type="button"
              onClick={() => respond("gave_life_to_jesus")}
              className="enter btn-primary"
              style={{ "--d": 8 } as CSSProperties}
            >
              Tell LIT I prayed
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setPrayed(true)} className="btn-primary px-8 py-4 text-base">
              I prayed this prayer
            </button>
            <button type="button" onClick={() => respond("has_questions")} className="btn-outline px-8 py-4 text-base">
              I have questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Phone: a bottom bar that keeps "Respond" one tap away while reading.
 * Hidden on the intro and once the response form is on screen.
 */
export function RespondBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const intro = document.getElementById("intro");
    const form = document.getElementById("respond");
    if (!intro || !form) return;
    const state = { pastIntro: false, formVisible: false };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === intro) state.pastIntro = !e.isIntersecting;
        if (e.target === form) state.formVisible = e.isIntersecting;
      }
      setShow(state.pastIntro && !state.formVisible);
    });
    io.observe(intro);
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 transition-all duration-500 sm:inset-x-auto sm:right-6 sm:bottom-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <a
        href="#respond"
        className="flex items-center justify-between gap-4 rounded-full bg-charcoal py-2 pr-2 pl-5 text-white shadow-2xl"
      >
        <span className="text-sm font-medium">Ready to respond to Jesus?</span>
        <span className="btn bg-flame px-5 py-2.5 text-white">Respond</span>
      </a>
    </div>
  );
}
