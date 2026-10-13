# LIT Church website (Living Temples Church, Kitwe)

Next.js 16 (App Router, Tailwind v4) on **Vercel** + **Supabase**. The product plan is in [PLAN.md](PLAN.md).

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in values (site works without Supabase; forms show a fallback)
npm run dev                  # http://localhost:3000
```

## Connect Supabase
1. Create a project at supabase.com and copy its URL and publishable key into `.env.local`.
2. Run the schema: paste `supabase/migrations/20261011000000_init.sql` into the SQL editor, or run `supabase db push` with the Supabase CLI.
3. Form submissions land in `people` + `journey_events` (visits, salvation responses) and `prayer_requests`. Every new person automatically gets a `followups` row due within 24 hours.
4. Staff access: sign in, then set your `profiles.role` (e.g. `admin`, `elder`, `followup`) in the table editor. Row-level security controls who can read what.

## Deploy (Supabase + Vercel)
Step-by-step guide: **[DEPLOY.md](DEPLOY.md)**. Security notes and pre-launch checklist: **[SECURITY.md](SECURITY.md)**.

## Where to edit content (for now)
| What | File |
|---|---|
| Service time, venue, cell groups, WhatsApp | `src/lib/site.ts` (+ env vars) |
| Daily devotionals (28-day series) | `src/content/devotionals.ts`. Set `approved: true` once reviewed. |
| Gospel steps / salvation prayer / Bemba text | `src/content/gospel.ts` |
| Sermons (paste YouTube links) | `src/content/sermons.ts` |
| Beliefs (draft) | `src/app/about/page.tsx` |

Content moves into Supabase with an admin editor in a later phase (the `devotionals` table already exists).

## Evangelism QR codes
Give each evangelist a code, e.g. `ABC123`, and print a QR for `https://<domain>/r/ABC123`. It opens the Know Jesus page, and any response is tagged with that code (`people.referral_code`).

## Install as an app (PWA)
The site can be installed on phones ("Get the app" / "App" button in the header and phone menu).
- **Android / Chrome / Edge:** the button opens the browser's install prompt.
- **iPhone:** the button shows the 3 "Share → Add to Home Screen" steps (Apple doesn't allow a prompt).
- It's an **online app shell**: `public/sw.js` caches nothing, so content is always live. With no connection, pages show a friendly "You're offline / Try again" screen.
- Installing needs **HTTPS** (Vercel provides it) or `localhost`.
- App icons are generated from the flame mark. When the real logo arrives, update `scripts/generate-icons.mjs` and run `node scripts/generate-icons.mjs`.
- Long-pressing the app icon offers shortcuts: Devotional, Know Jesus, Check in, Prayer (`src/app/manifest.ts`).
