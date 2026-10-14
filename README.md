# LIT Church website (Living Temples Church, Kitwe)

Next.js 16 (App Router, Tailwind v4) on **Vercel** + **Supabase**. The product plan is in [PLAN.md](PLAN.md).

## Run locally
```bash
npm install
npm run db:start   # local database in Docker (Supabase-compatible); writes keys + an admin password to .env.local
npm run dev        # http://localhost:3000
```
Without Docker the site still runs on built-in content (`cp .env.example .env.local`); forms then show a "not connected" message.
`npm run db:stop` stops the database; `npm run db:reset` wipes local data and re-runs all migrations.

## Admin side: http://localhost:3000/admin
Sign in with the **`ADMIN_PASSWORD`** from `.env.local` (on Vercel: from the project's environment variables).

| Section | What you can do |
|---|---|
| **Church details** | Service day, time and length, venue and address (map updates automatically), mission, lead pastor, WhatsApp number and community link, cell groups (leader, meeting time) |
| **Sermons** | Add, edit, hide or delete sermons; paste a YouTube or Facebook link and it plays on the site |
| **Devotionals** | Edit any of the 28 days, tick **Approved**, or restore the original text |
| **People & follow-up** | Everyone from Plan a Visit, Know Jesus and first-time check-ins: their journey, a one-tap WhatsApp message, follow-up stage and notes. Overdue (>24h) are flagged |
| **Prayer requests** | Read requests (private ones marked), set Praying / Answered / Archived, record testimonies |
| **Attendance** | Today's headcount, first-time guests, service history, QR poster and usher kiosk links |

Changes appear on the public website immediately (cached content is refreshed on save).

## Connect Supabase
1. Create a project at supabase.com and copy its URL and publishable key into `.env.local`.
2. Run the schema: paste `supabase/migrations/20261011000000_init.sql` into the SQL editor, or run `supabase db push` with the Supabase CLI.
3. Form submissions land in `people` + `journey_events` (visits, salvation responses) and `prayer_requests`. Every new person automatically gets a `followups` row due within 24 hours.
4. Staff access: sign in, then set your `profiles.role` (e.g. `admin`, `elder`, `followup`) in the table editor. Row-level security controls who can read what.

## Deploy (Supabase + Vercel)
Step-by-step guide: **[DEPLOY.md](DEPLOY.md)**. Security notes and pre-launch checklist: **[SECURITY.md](SECURITY.md)**.

## Content that still lives in code
| What | File |
|---|---|
| Built-in defaults for church details | `src/lib/site.ts` (`defaultSettings`) |
| Original devotional text (admin edits override it) | `src/content/devotionals.ts` |
| Gospel steps / salvation prayer / Bemba text | `src/content/gospel.ts` |
| Current sermon series banner | `src/content/sermons.ts` (`currentSeries`) |
| Beliefs (draft) | `src/app/(site)/about/page.tsx` |

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
