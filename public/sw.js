// LIT Church service worker.
// Deliberately minimal: it makes the site installable as an app, but caches nothing.
// Every page always comes fresh from the network. If the phone has no connection,
// page navigations get a friendly "you're offline" screen instead of the browser's error.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const OFFLINE_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Offline | LIT Church</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#1c1a19;color:#faf8f4;
       font-family:system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center;padding:24px}
  h1{font-size:28px;margin:16px 0 8px} p{opacity:.75;max-width:30ch;margin:0 auto 24px;line-height:1.5}
  button{background:#e8601a;color:#fff;border:0;border-radius:999px;padding:14px 28px;font-size:16px;font-weight:600}
</style></head>
<body><main>
  <svg width="48" height="60" viewBox="0 0 32 40" aria-hidden="true"><path fill="#e8601a" d="M16 2c2 6 9 9 9 18a9 9 0 0 1-18 0c0-5 3-8 5-10 0 3 1 5 3 6-1-5 0-10 1-14z"/></svg>
  <h1>You’re offline</h1>
  <p>The LIT Church app needs an internet connection. Please check your data or Wi-Fi.</p>
  <button onclick="location.reload()">Try again</button>
</main></body></html>`;

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return; // everything else: browser default, no caching
  event.respondWith(
    fetch(event.request).catch(
      () => new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } }),
    ),
  );
});
