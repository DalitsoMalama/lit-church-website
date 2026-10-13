# Going live: Supabase + Vercel

Total time: about 30–45 minutes. You need a GitHub account (the code is at
[DalitsoMalama/lit-church-website](https://github.com/DalitsoMalama/lit-church-website)), plus free
accounts at [supabase.com](https://supabase.com) and [vercel.com](https://vercel.com). Sign in to both with GitHub.

---

## 1. Database (Supabase)

1. **Create a project:** name it `lit-church`, set a strong database password (save it in a password manager), and pick the region **closest to Zambia** that's offered.
2. **Create the tables and security rules:** open **SQL Editor → New query**, paste the whole of `supabase/migrations/20261011000000_init.sql` and click **Run**. Then do the same for `supabase/migrations/20261012000000_attendance.sql`. Both should report *Success*.
3. **Turn off public sign-ups for now** (there are no staff logins yet): **Authentication → Sign In / Providers → Email**, switch off **Allow new users to sign up**.
4. **Copy three values** from **Project Settings → API Keys** (or **Data API**) for step 2:
   - **Project URL**, e.g. `https://abcd1234.supabase.co`
   - **Publishable key** (`sb_publishable_…`), or the legacy **anon** key
   - **Secret key** (`sb_secret_…`), or the legacy **service_role** key. ⚠️ Treat it like a password.

## 2. Website (Vercel)

1. **Add New → Project →** import `DalitsoMalama/lit-church-website`. Vercel detects Next.js automatically; leave the build settings as they are.
2. Before clicking **Deploy**, open **Environment Variables** and add:

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from step 1.4 | |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key | Public by design |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret (service_role) key | **Mark as Sensitive.** Never prefix with `NEXT_PUBLIC_` |
| `ATTENDANCE_PIN` | A passphrase, **8+ characters** | Share only with ushers & elders |
| `ATTENDANCE_SECRET` | Random 64-character value | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | e.g. `260971234567` | Church WhatsApp, no `+` or spaces |
| `NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL` | Your community invite link | Optional until you have it |
| `DEVOTIONAL_START_DATE` | e.g. `2026-10-19` | Day 1 of "Come As You Are" |
| `NEXT_PUBLIC_SITE_URL` | `https://litchurch.org.zm` | **Leave empty until the domain is live.** The Vercel address is used automatically |

3. Click **Deploy**. In about 2 minutes you get a `https://lit-church-website….vercel.app` address.

> Variables starting with `NEXT_PUBLIC_` are built into the site. After changing one, go to **Deployments → ⋯ → Redeploy**.

## 3. Check the live site (10 minutes)

- [ ] Home shows **This Sunday** with the right date and countdown.
- [ ] **Know Jesus:** scroll to see scarlet → snow; send a test response. It appears in Supabase **Table Editor → people**.
- [ ] **Plan a Visit** and **Prayer:** send a test each.
- [ ] **/checkin:** check in once, then open **/attendance**, enter the PIN, and see the count.
- [ ] Print the QR poster from **/checkin/poster** for the venue entrance.
- [ ] On an Android phone, the **App** button installs the app. On iPhone: Share → Add to Home Screen.
- [ ] Delete your test rows in the Supabase Table Editor afterwards.

## 4. Protection (recommended before announcing)

**Vercel → Project → Firewall → Configure → New Rule:**
- Name: `Form rate limit`
- If **Request Path** starts with `/visit`, `/know-jesus`, `/prayer`, `/checkin` or `/attendance`, **and Method** is `POST`
- Then **Rate Limit**: 30 requests per 60 seconds per IP → **Deny** (429)

See [SECURITY.md](SECURITY.md) for the full checklist, including registering with Zambia's Data Protection Commissioner.

## 5. Your own domain (when ready)

1. Register **`litchurch.org.zm`** with a ZICTA-accredited registrar (e.g. ZAMNET). `.org.zm` needs the church's registration documents.
2. **Vercel → Project → Settings → Domains → Add** `litchurch.org.zm` and `www.litchurch.org.zm`. Vercel shows the DNS records to create at your registrar (usually an **A** record `76.76.21.21` for the bare domain and a **CNAME** `cname.vercel-dns.com` for `www`).
3. Once it's verified, set `NEXT_PUBLIC_SITE_URL=https://litchurch.org.zm` and **Redeploy**.
4. Reprint the QR poster: it now points at the new domain.

## 6. Day-to-day updates

- Every push to `main` on GitHub **deploys automatically**, and **CI** (GitHub → Actions) runs lint, tests, a build and the database security tests.
- Changed the database? Add a new file in `supabase/migrations/`, run it in the SQL Editor, and confirm with `bash supabase/tests/run.sh`.
