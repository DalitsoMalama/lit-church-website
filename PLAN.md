# LIT Church (Living Temples Church): Website Plan

**Location:** Kitwe, Zambia. Sunday service 8:00 AM at Havemore Restaurant, 20 Mpenzeni Avenue, Parklands
**Lead pastor:** Reverend Mwamba
**Stack:** Next.js on Vercel + Supabase (Postgres, Auth, Storage, Realtime, Edge Functions)
**Languages:** English (primary), Bemba (for local outreach)
**Goal:** A place people return to every day for spiritual resources and routines, and a working tool for evangelism on the streets of Kitwe and online.

> Identity theme: *"Do you not know that your body is a temple of the Holy Spirit?"* (1 Cor 6:19). The flame in the logo stands for the Holy Spirit lighting up living temples. The design, the gospel flow and the growth pathway all build on this.

---

## 1. Research summary: what the best church websites do

Sites reviewed: Elevation, Saddleback, Life.Church (Church Online Platform), VOUS, Cedarcrest, The Orchard, Fusion, Bethel Redding, Brentwood Baptist, and the 2026 roundups (ReachRight, Givebutter, Colorlib).

| Pattern | Who does it well | What LIT will do |
|---|---|---|
| Clear first-visit path ("I'm New" / "Plan Your Visit") | Cedarcrest, Fusion | **"Join us this Sunday"** card with the time, a Google Maps pin for the venue, and what to expect |
| Service times and location above the fold | VOUS, Fusion, The Orchard | Shown on the homepage, with a "Get directions" link |
| Latest sermon first | Elevation, Saddleback | Sermon series pages (e.g. *The Revelation of Grace*), audio first |
| **"I want to…" next-step buttons** | **Saddleback** | The **LIT Pathway** (§3B) |
| Live service with chat hosts, live prayer and a "Salvation Moment" | Life.Church | Facebook/YouTube Live embed plus a "Respond / Pray with us" panel |
| Devotional or reading-plan prompt | The Orchard, Elevation | Kept **on our own site** (most churches send people to YouVersion) |
| Personal dashboard | Saddleback, Real Life Ministries | **My Walk** |
| Prayer and care hub | Saddleback | Prayer wall, private requests, and requests for healing and deliverance prayer |
| Multiple languages | Saddleback | English and Bemba |

**Where most churches fall short (our opportunity):**
1. No daily reason to come back.
2. Evangelism is a page, not a tool.
3. A response (salvation, a visit, a prayer request) doesn't reach a person who follows up.

---

## 2. Zambia-specific decisions

| Area | Decision |
|---|---|
| **Primary channel** | **WhatsApp.** Every call to action offers a WhatsApp option: a click-to-chat link (`wa.me/260…`), "Join our WhatsApp Community", and "Share on WhatsApp" buttons. Email is secondary. |
| **Payments** | **Mobile money (Airtel Money, MTN MoMo, Zamtel Kwacha) plus Visa/Mastercard** through one aggregator. First choice: **Flutterwave** (its Zambia mobile-money API supports Airtel, MTN and Zamtel; the customer approves the payment on their phone; hosted checkout also takes cards). Local alternatives to compare on fees and settlement: **ZynlePay** and **Lenco**. The church needs a registered entity and bank account for KYC. Amounts are in **ZMW (K)**. |
| **Privacy law** | **Data Protection Act No. 3 of 2021** (and Zambia's cyber security and cyber crimes laws). The church likely needs to **register as a data controller** with the Office of the Data Protection Commissioner. Consent must be explicit, informed and specific, a breach must be reported within **24 hours**, and security measures must be in place. Supabase has no Zambian region, so storing data abroad (e.g. in the EU) is a cross-border transfer and needs consent wording to cover it. **Confirm with a Zambian lawyer before launch.** |
| **Connectivity** | Mobile data is costly. Use a lightweight PWA (under about 200 KB on first load), compressed images, an **audio-first** sermon option, a "data saver" toggle, offline devotionals, and offline field mode. |
| **Bible translations** | NKJV, NIV and NLT are all copyrighted, but each publisher allows quoting up to roughly **500 verses** without written permission, provided the copyright notice appears. **Plan:** (a) devotionals and plans quote the passage inline with the copyright notice; (b) "Read full chapter" opens **bible.com (YouVersion)** in the chosen translation, including the **Revised Bemba Bible** (Bible Society of Zambia, 2015); (c) later, consider **API.Bible** (free non-commercial Starter plan, up to 3 copyrighted translations; **NIV terms are stricter**, so confirm with Biblica). |
| **Bemba** | Interface text translated by the media team. Priority items in Bemba: **the gospel presentation, the salvation response, prayer forms and invite cards** (what is used on the street), plus **Bemba audio devotionals** (voice notes recorded by elders). |
| **Content team** | Reverend Mwamba and the elders write; the media team edits, designs, schedules and translates. Workflow: Draft → Review (Reverend/Elder) → Scheduled → Published. Aim to schedule **4 weeks ahead**. |

---

## 3. Product: three pillars

```
   WELCOME (come as you are)    GROW (living temples)          GO (set ablaze)
   ─────────────────────────    ─────────────────────          ───────────────
   Join us this Sunday          My Walk dashboard              Street evangelism mode
   Watch live / sermons         Daily devotional (EN/Bemba)    QR invite cards
   Know Jesus (gospel)          Reading plans                  Follow-up pipeline
   Events                       Prayer wall & journal          WhatsApp sharing
   Give (mobile money / card)   LIT Pathway                    Outreach events & teams
                                Holy Spirit & prayer routines  Impact dashboard
                └────────── shared "People + Journey" core ──────────┘
```

### A. WELCOME (public site)
- **Homepage:**
  - Hero with a real photo of worship or outreach, "Come as you are" (Isaiah 1:18), the Sunday card (8:00 AM, Havemore Restaurant, map link) and a "Live now" badge
  - Three buttons: **Join us Sunday · Watch · Know Jesus**
  - Current sermon series banner, generated from the same artwork as the flyers
  - Today's verse and devotional teaser
  - "I want to…" next steps
  - WhatsApp Community button
- **Plan a Visit:** what a Sunday at LIT is like (praise and worship, the Word, prayer ministry), a Google Maps embed and parking, kids, and a form that **sends the welcome team a WhatsApp alert**.
- **Watch:** livestream embed (Facebook Live or YouTube), with a sermon archive organized by series. Each sermon has audio, video, notes and a group discussion guide. Podcast RSS feed for Spotify/Apple.
- **Know Jesus:** the gospel presentation (see the gospel flow below), with a "I gave my life to Jesus today / I want prayer / I have questions" form that **starts follow-up**.
- **Give:** one-time or monthly giving to tithe, offering, building fund or missions. Mobile money via a phone prompt, or card. Includes a receipt and an optional giving statement.
- **About:** beliefs (a Pentecostal statement of faith), Reverend Mwamba and the elders, the LIT story and vision.
- **Events:** services, crusades, outreach days, conferences.

### B. GROW (why people stay)
- **My Walk dashboard:** today's devotional, plan progress, prayer list, next pathway step, cell or home group, and upcoming events.
- **Daily Devotional:** each one has a scripture passage, a word from the Reverend or an elder, a prayer, a **declaration**, and one action for the day. Available as text (EN/Bemba) and as a short audio clip. Delivered by **WhatsApp Channel** at a set time, web push, or email.
- **Reading plans:** Bible in a year, Gospels in 30 days, **Acts and the Holy Spirit**, plans that follow the sermon series (e.g. *Revelation of Grace*), and topical plans (faith, healing, finances, family). Includes progress tracking, gentle streaks, catch-up mode, and doing a plan with a friend or group.
- **Prayer:**
  - Public prayer wall (moderated) with an "I prayed" counter that notifies the requester
  - Private requests sent to the Reverend and the prayer team (healing, deliverance, family, work)
  - **Prayer journal** with testimonies of answered prayer, which can be shared publicly on a **Testimonies** page
  - Guided routines: morning prayer, praying in the Spirit, a weekly **fasting day** reminder, and midnight-prayer events
- **Spiritual habits ("Keep the fire burning", Leviticus 6:13):** the user picks routines (Word, prayer, fasting, worship, giving, witnessing) and gets reminders and a weekly check-in.
- **Scripture memory:** verse cards with spaced repetition and Bemba options.
- **LIT Pathway (growth track):**
  1. **Born Again:** salvation and assurance (John 3:3)
  2. **Foundations class:** short video and audio lessons (grace, the Word, prayer, the Church)
  3. **Water Baptism:** sign-up
  4. **Baptism of the Holy Spirit:** teaching from Acts 2 and Joel 2:28, plus a request for prayer
  5. **Membership and Cell Group:** join a home fellowship
  6. **Serve:** media, praise team, ushering, children, evangelism
  7. **Witness:** evangelism training, then join the outreach team (Acts 1:8, John 14:12, "greater works")

  Leaders can see where people stall at each stage.
- **Sermon notes:** fill-in notes during the service, saved to My Walk.
- **Cell groups:** find a group by Kitwe area (Parklands, Riverside, Nkana East, …).

### C. GO (evangelism toolkit)

**Gospel flow (Pentecostal), used everywhere: the web page, field mode, and Bemba versions:**
1. God loves you, and you were made to be His temple (John 3:16, 1 Cor 6:19)
2. Sin separated us (Romans 3:23)
3. **Jesus died** for our sins (1 Cor 15:3)
4. **Jesus rose** again and is alive (1 Cor 15:4; Romans 10:9)
5. Repent, believe and be baptized (Acts 2:38)
6. **Receive the Holy Spirit**, poured out on all flesh (Acts 2:17, 39; Joel 2:28)
7. Live empowered to do the **greater works** Jesus promised (John 14:12; Acts 1:8)

Then: a prayer of salvation and the response options.

**On the ground (field mode, an offline mobile PWA):**
- **Personal QR invite cards.** Each evangelist gets a code (`lit.church/r/ABC123`), printed on cards and on the green and white street signs ("Come As You Are", "You Must Be Born Again"). A scan opens the Know Jesus page in English or Bemba, and the visit is credited to that evangelist.
- **Gospel presentation mode:** full-screen swipeable slides on the phone (EN/Bemba), usable while sitting with someone.
- **Quick capture form** (works without signal, syncs later): name, phone or WhatsApp number, area of Kitwe, and outcome. Outcomes: *heard the gospel / gave life to Jesus / wants water baptism / wants Holy Spirit prayer / prayed for healing / wants Bible study / not interested*. Includes a **consent checkbox** in the person's language.
- **Follow-up pipeline:** new contacts are auto-assigned to a follow-up person, with a **WhatsApp message within 24 hours** and an in-person visit or call within 7 days. Stages: New → Contacted → Visited → Attending → Foundations → Baptized → Cell group. Overdue follow-ups trigger reminders.
- **Outreach events:** plan street, market, hospital, campus or door-to-door outreach in Kitwe areas. Assign teams, check in, and get an automatic post-event report (people reached, decisions, prayers).
- **Testimony builder** and **training hub:** how to share, how to answer common questions, how to pray for the sick, and conduct and safety on outreach.

**Online:**
- **WhatsApp-first sharing:** verse cards, sermon clips and devotional cards in a **flyer-style design** with a one-tap "Share to WhatsApp / Status". Every link carries the sharer's referral code.
- **Sermon-series flyer generator:** the media team fills in the title, speaker, date, venue and photo, and the site produces a consistent flyer image plus an event page.
- **"Invite a friend this Sunday"** message template in English or Bemba.
- **Seeker path:** Know Jesus page, then "Ask a question" (WhatsApp click-to-chat to a responder), then a follow-up sequence.
- **Campaign landing pages** for Easter, crusades and conferences, with tracking.

**Impact dashboard (Reverend and leaders):** gospel conversations, decisions, Holy Spirit prayer requests, baptisms, overdue follow-ups, pathway progress, top evangelists and shared content, and giving totals.

---

## 4. Brand & design

From the logo and flyers:

| Token | Use | Approximate value |
|---|---|---|
| Flame orange | Primary actions, highlights | `#F26A1B` |
| Flame red | Accent, live badge | `#D7261E` |
| Flame gold | Highlights, devotional accents | `#F7B500` |
| Charcoal | Text, the "lit" wordmark | `#2B2B2B` |
| LIT green | Outreach and campaign sections (matches the street signs and flyers) | `#1E8C3A` |
| Off-white | Background | `#FAF8F5` |

- Bold condensed headlines (like the flyers) for banners. A clean sans-serif (Inter or Poppins) for reading.
- Use **real photos** of the congregation and outreach. Get consent from anyone pictured, as the Data Protection Act requires.
- Dark mode uses a charcoal background with the flame accents.
- Files: `Logo.jpg` needs a **transparent PNG/SVG version** (ask the designer, or we can trace it). `art.jpg` is the sermon-flyer style. `photo.jpg` is outreach photography.

---

## 5. Users & roles

| Role | Can do |
|---|---|
| Visitor | Browse, watch, read, give, submit prayer requests, salvation responses or visit forms |
| Member | My Walk, plans, journal, habits, prayer wall, invite links |
| Evangelist | Field mode, their own contacts and follow-ups, personal stats |
| Follow-up / Prayer team | Assigned contacts and prayer requests |
| Cell leader | Their group's members and prayer list |
| Media team | Content management system (devotionals, sermons, flyers, translations); drafts need approval |
| Elder / Reverend (Admin) | Approve content, see everyone and all dashboards, moderation, giving reports |

Sign-in uses Supabase Auth with **phone number OTP** as the main method (most people use a phone number rather than email), plus Google and email magic links. Every table is protected by row-level security.

---

## 6. Technical architecture

```
Next.js (App Router, TypeScript, Tailwind, shadcn/ui) ── Vercel
 ├─ Public pages: static/ISR (fast and good for SEO; local SEO for "church in Kitwe")
 ├─ App pages: My Walk, Field mode, Admin
 ├─ PWA: Serwist service worker + IndexedDB offline queue
 ├─ i18n: next-intl (en, bem)
 ├─ Vercel Cron: devotional sends, follow-up reminders
 └─ Webhooks: Flutterwave (payment confirmation), WhatsApp

Supabase
 ├─ Postgres + RLS · Auth (phone OTP via Twilio/Africa's Talking)
 ├─ Storage: images, flyers, sermon audio (or Cloudflare R2 for cheap audio)
 ├─ Realtime: prayer wall, live-service chat
 └─ Edge Functions: notifications, flyer image generation

Integrations
 ├─ Payments: Flutterwave (Airtel/MTN/Zamtel + Visa/Mastercard), with ZynlePay/Lenco as alternatives
 ├─ WhatsApp: Community link + wa.me now; Meta WhatsApp Cloud API later (paid per conversation)
 ├─ SMS fallback: Africa's Talking or Twilio
 ├─ Video: Facebook Live / YouTube embed
 ├─ Bible: inline quotes + bible.com links; API.Bible later
 ├─ Maps: Google Maps embed (venue), Leaflet + OpenStreetMap for outreach areas
 └─ Analytics: Vercel Analytics / Plausible
```

### Core data model (first draft)
```
profiles(id→auth.users, full_name, phone, language[en|bem], notify_channel, role)
people(id, profile_id?, name, phone, whatsapp, area, source, referred_by, consent_at, consent_lang, status)
journey_events(id, person_id, type, payload, created_by, created_at)
series(id, title, image) / sermons(id, series_id, title, speaker, date, scripture, audio_url, video_url, notes_md)
devotionals(id, publish_date, lang, title, scripture_ref, scripture_text, body_md, prayer, declaration, audio_url, status, author_id, approved_by)
reading_plans / plan_days / plan_enrollments / plan_progress
habits / habit_logs
prayer_requests(id, person_id, body, category, visibility[public|team|private], status, answered_at, testimony)
prayer_interactions(request_id, user_id, prayed_at)
journal_entries(id, user_id, body)
pathway_steps / pathway_progress
cell_groups / cell_members
events(id, title, starts_at, venue, map_url, flyer_url)
outreach_events / outreach_teams / outreach_checkins
referral_codes(code, user_id) / referral_hits(code, path, at)
followups(person_id, assigned_to, stage, due_at, last_contact_at, notes)
donations(id, person_id?, amount_zmw, fund, method[airtel|mtn|zamtel|card], provider_ref, status)
```

---

## 7. Non-negotiables
- **Data protection (Zambia DPA 2021):** register with the Data Protection Commissioner, collect explicit consent (in English or Bemba) on every form, publish a privacy notice, keep only the data needed, support deletion requests, and have a 24-hour breach plan. Evangelism contacts are visible only to the evangelist and the follow-up team.
- **Safeguarding:** moderation for the prayer wall and chat, no data about minors in public, photo consent, and outreach conduct guidelines.
- **Low data use** and accessibility (WCAG AA, large tap targets, works on budget Android phones).
- **Copyright:** a Bible translation notice on every page that quotes scripture, and only licensed music in sermon media.

---

## 8. Roadmap

| Phase | Weeks | Deliverables |
|---|---|---|
| **0. Foundations** | 1 | Domain (e.g. `litchurch.org.zm` / `lit.church`), Vercel and Supabase projects, brand tokens, vector logo, schema v1, phone sign-in |
| **1. Welcome MVP** | 2–4 | Homepage, Plan a Visit, Know Jesus + response, sermons (audio-first), Watch embed, events, WhatsApp buttons, admin content tools with approval flow, EN + Bemba scaffold |
| **2. Give** | 5 | Flutterwave mobile money + card, funds, receipts |
| **3. Grow core** | 6–9 | My Walk, daily devotional (text + audio, WhatsApp Channel + push), reading plans, prayer wall/private/journal/testimonies, PWA install |
| **4. Go core** | 10–13 | QR referral codes, offline field mode + Bemba gospel presentation, follow-up pipeline + reminders, WhatsApp share cards, flyer generator |
| **5. Deepen** | 14–18 | LIT Pathway courses, cell groups, habits and fasting, scripture memory, outreach events + maps, impact dashboard |
| **6. Expand** | later | Live service chat + live prayer, WhatsApp Cloud API bot, more languages (Nyanja), native app wrapper |

---

## 9. Decisions (11 Oct 2026)
| Item | Decision |
|---|---|
| Mission / vision | "Beautifying Every Life and Destiny by the Manifestation of the Truth." Shown site-wide. A fuller statement of beliefs is drafted on /about for the Reverend to confirm. |
| Domain | **`litchurch.org.zm`** (primary: local trust and Zambian search ranking; `.org.zm` suits a registered church). Register through a ZICTA-accredited registrar such as ZAMNET. Optional backup: `litchurchzambia.org`. Use the Vercel preview URL until then. |
| Registration | Church is registered, so it can complete Flutterwave KYC and register as a data controller. |
| Livestream | Not yet. Post short sermon clips (YouTube links embed automatically) and add livestream later. |
| Cell groups | Chimwemwe, Riverside, Ndeke, Buchi (leaders TBA). |
| Launch devotional series | **"Come As You Are"**, 28 days, one anchor verse per week: Isaiah 1:18 → John 3:3 → Matthew 18:13 → Matthew 19:26. Drafts are written and marked "awaiting review". |
| Logo | Placeholder SVG flame until the vector logo arrives. |

## 10. Progress
**Phase 1 (Welcome MVP) built:** see README.md. Includes the homepage, Plan a Visit, Know Jesus (Pentecostal gospel flow + response), the daily devotional (28 days), sermons, cell groups, prayer requests, Give (coming-soon page), About, Privacy, QR referral links `/r/CODE`, and the Supabase schema with RLS.

## 11. Still needed
1. **WhatsApp Community link** and the church WhatsApp number.
2. **Reverend/Elder review** of the 28 devotionals, the beliefs list (/about) and the gospel wording (/know-jesus).
3. **Bemba translations** of the gospel steps and the salvation prayer (media team).
4. **Vector logo** and more photos (with consent).
5. Cell group leaders and meeting times; ministry leads.
6. Short sermon video links (YouTube).
7. Legal review of the privacy notice, and data controller registration.
