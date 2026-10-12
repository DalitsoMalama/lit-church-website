# Security & testing: LIT Church website

*Last full review: 11 Oct 2026*

## How it was tested
| Area | Method | Result |
|---|---|---|
| Database access rules (RLS) | 27 attack tests on a real Postgres with Supabase-style roles (`supabase/tests/`) | **27/27 pass** |
| Forms end to end | Real submissions through the site → PostgREST (Supabase's API layer) → Postgres | Visit, Know Jesus response (with referral code), prayer, check-in (first-time, repeat, kiosk) **all saved correctly** |
| Validation & service times | `npm test` (33 unit tests) | **33/33 pass** |
| Attendance report | PIN flow, forged/old/tampered cookies, brute-force lockout | **Forgeries rejected; lockout after 5 tries** |
| Routes, headers, injection | HTTP sweep of every route, XSS payloads in `?service=` and `/r/…` | **No reflected XSS; correct 404s** |
| Secrets | Scanned the browser JavaScript bundle for the service-role key, PIN and secret names | **None present** |
| Dependencies | `npm audit` | **0 vulnerabilities** |

## Vulnerabilities found and fixed
| # | Finding | Fix |
|---|---|---|
| S1 | No security headers; `X-Powered-By` leaked the framework | CSP, `frame-ancestors 'none'` + `X-Frame-Options`, `nosniff`, Referrer-Policy, Permissions-Policy, HSTS, COOP; powered-by header removed (`next.config.ts`) |
| S2 | Attendance PIN could be brute-forced; unlock cookie was a static PIN hash that never expired | Signed **8-hour** session tokens (HMAC, invalidated when the PIN changes), **5 attempts / 15 min** lockout, **minimum 8-character PIN**, `SameSite=Strict` cookie |
| S3 | Public forms had no rate limit | Per-connection limits (20 per 10 min per form; 300 for check-in because a whole congregation may share one Wi-Fi IP) plus the existing honeypot |
| S4 | "Remember me" on a shared phone exposed the previous person's **full phone number** | Number masked (`••• ••• 123`); **kiosk mode** `/checkin?kiosk=1` for ushers never remembers anyone and resets after each check-in; malformed stored data ignored safely |
| S5 | Check-in told you whether a phone number had already checked in today | Duplicate check-ins now get the same answer as new ones |
| S6 | Free-text event name from the QR link and referral codes weren't sanitised | Event names limited to letters, numbers and simple punctuation; referral codes to `A–Z 0–9 _ -`; control characters stripped from all free text |
| F1 | A phone "number" made of `+` and spaces passed validation, then failed in the database | Phone must normalise to 9–15 digits (`+260…`) |
| F2 | Tapping "First time" before the page finished loading didn't show the first-timer questions | Shown with CSS `:has()`, so it works even before JavaScript loads |
| F3 | `/devotional/99`, `/devotional/abc` returned **200** instead of **404** | Day validated before streaming starts |
| F4 | Search engines could index staff and check-in pages | `robots.txt` disallows `/attendance`, `/checkin`, `/r/`, `/calendar` |

## Known, accepted risks (with recommendations)
1. **The public Supabase key allows direct inserts** into the intake tables, bypassing the website's rate limits. The database rules still block reading, editing and anything invalid. *If spam ever appears:* add Cloudflare Turnstile to the forms, or move public writes behind a server-only key.
2. **Rate limits are kept in memory per server instance.** *Before launch:* add a Vercel Firewall rate-limit rule, e.g. 30 POST requests per minute per IP on `/visit`, `/know-jesus`, `/prayer`, `/checkin` and `/attendance`.
3. **The attendance report uses a shared PIN** until staff sign-in (Supabase Auth with roles) is built. Use a long PIN, share it only with ushers and elders, and change it if someone leaves.
4. **Check-ins are linked to people by phone number.** Someone who knows another person's number could check them in. Low impact.
5. **The CSP allows inline scripts**, because Next.js's static pages need them (nonces would make every page render per request). All other CSP protections apply.

## Deployment checklist
- [ ] `ATTENDANCE_PIN`: at least 8 characters, ideally a passphrase.
- [ ] `ATTENDANCE_SECRET`: a random 32+ character value (`openssl rand -hex 32`).
- [ ] `SUPABASE_SERVICE_ROLE_KEY`: server-only; **never** prefix it with `NEXT_PUBLIC_`.
- [ ] Run both migrations in `supabase/migrations/`, then `bash supabase/tests/run.sh` against any schema change.
- [ ] Vercel Firewall rate-limit rule (risk 2).
- [ ] Supabase Auth: when staff sign-in is added, keep new users as `member` (the default) and promote staff by hand.
- [ ] Register with the Office of the Data Protection Commissioner and finalise the privacy notice (Data Protection Act 2021).
- [ ] Re-run `npm audit`, `npm test` and `npm run build` before each release.
