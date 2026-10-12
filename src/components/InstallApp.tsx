"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/* ── Install state ──────────────────────────────────────────────────────
   Android / Chrome / Edge fire `beforeinstallprompt`; we keep it and show our
   own button. iPhone has no prompt, so we show "Add to Home Screen" steps.
   Nothing shows once the site is already running as an installed app.      */

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type Mode = "hidden" | "prompt" | "ios";

let deferred: InstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // we show our own button instead of the browser's mini-banner
    deferred = e as InstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installed = true;
    emit();
  });
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

function getMode(): Mode {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone || installed) return "hidden";
  if (deferred) return "prompt";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "hidden";
}

function useInstallMode() {
  return useSyncExternalStore<Mode>(subscribe, getMode, () => "hidden");
}

/** Registers the (network-only) service worker that makes the site installable. */
export function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
  }, []);
  return null;
}

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M12 7v7m-3-3 3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * "Install app" button. `compact` for the header, `block` for the phone menu.
 * Renders nothing when installing isn't possible or the app is already installed.
 */
export function InstallButton({ variant = "compact" }: { variant?: "compact" | "block" }) {
  const mode = useInstallMode();
  const dialog = useRef<HTMLDialogElement>(null);
  if (mode === "hidden") return null;

  const onClick = async () => {
    if (mode === "ios") return dialog.current?.showModal();
    if (!deferred) return;
    const prompt = deferred;
    await prompt.prompt();
    await prompt.userChoice;
    deferred = null; // a prompt can only be used once
    emit();
  };

  const cls =
    variant === "block"
      ? "btn-primary w-full py-4 text-base"
      : "btn border border-flame/40 bg-flame/10 px-3.5 py-2 text-flame hover:-translate-y-0.5 hover:bg-flame hover:text-white";

  return (
    <>
      <button type="button" onClick={onClick} className={cls}>
        <PhoneIcon />
        {variant === "block" ? (
          "Install the LIT app"
        ) : (
          <>
            <span className="sm:hidden">App</span>
            <span className="hidden sm:inline">Get the app</span>
          </>
        )}
      </button>
      {mode === "ios" && <IosSteps ref={dialog} />}
    </>
  );
}

function IosSteps({ ref }: { ref: React.Ref<HTMLDialogElement> }) {
  return (
    <dialog
      ref={ref}
      className="m-auto w-[min(92vw,26rem)] rounded-3xl bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close(); // tap outside to close
      }}
    >
      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-h3">Add LIT Church to your Home Screen</h2>
          <form method="dialog">
            <button className="rounded-full p-1 text-2xl leading-none text-muted" aria-label="Close">
              ×
            </button>
          </form>
        </div>
        <ol className="space-y-4">
          <li className="flex items-center gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-flame font-semibold text-white">1</span>
            <span>
              Tap the <strong>Share</strong> button{" "}
              <svg viewBox="0 0 24 24" className="inline size-5 align-text-bottom text-[#0a84ff]" fill="none" stroke="currentColor" strokeWidth="1.75" aria-label="Share icon">
                <path d="M12 3v12m-4-8 4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>{" "}
              at the bottom (or top) of Safari.
            </span>
          </li>
          <li className="flex items-center gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-flame font-semibold text-white">2</span>
            <span>
              Scroll down and tap <strong>Add to Home Screen</strong>.
            </span>
          </li>
          <li className="flex items-center gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-flame font-semibold text-white">3</span>
            <span>
              Tap <strong>Add</strong>. LIT Church will appear on your Home Screen like an app.
            </span>
          </li>
        </ol>
        <p className="text-sm text-muted">The app needs an internet connection, just like the website.</p>
      </div>
    </dialog>
  );
}
