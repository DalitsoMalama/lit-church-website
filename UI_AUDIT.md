# LIT Church: UI/UX Audit & Plan to Make It Less Generic

*Audit date: 12 Oct 2026 · Reviewed every page at desktop (1280px) and phone (375px) widths, in light and dark mode.*

---

## 1. Verdict

The site is now **clean and professional, but anonymous**. Hide the logo and it could be any church in any city, or even a design agency. That's because it is built from the current "premium template" kit: cream background, pill buttons, rounded white cards, a serif headline with one italic word, a thin line before each small label, and every element fading up as you scroll.

Meanwhile, LIT already has a **strong, recognisable visual identity, and it's not on the website**. It lives on the street:

- the **green "COME AS YOU ARE" signboards** with a white scripture strip
- the **flyers**: saturated green, a red ribbon banner, yellow headline type, and a cut-out portrait of the Reverend
- the **flame** in the logo
- **real people on the streets of Kitwe**

**Core recommendation:** stop decorating a template. Build the design system from LIT's own street evangelism.

---

## 2. Findings

### A. Why it feels generic
| # | Finding | Where |
|---|---|---|
| A1 | **Every inner page uses the same template**: small label → serif H1 → grey intro → grid of identical white cards. Nine pages share one layout. | All inner pages |
| A2 | **Trend-kit styling.** Cream + orange, rounded cards, a line before every label, one italic accent word per heading. Polished, but seen everywhere in 2025–26. | Global |
| A3 | **Brand underused.** The flyer palette (green, red, yellow) appears only in the scrolling verse strip and the series panel. The signboards, ribbon and Reverend cut-out aren't used at all. | Global |
| A4 | **No people.** One photo, used twice (home hero and About). The Reverend is shown as a letter **"M"** placeholder, and all 4 cell groups read *"Leader: To be announced"*. There are no testimonies or congregation faces. | Home, About, Groups |
| A5 | **No sense of place.** Kitwe, the Copperbelt and Bemba appear only in body text: no greeting, no map, no local cues. | Global |
| A6 | **Uniform motion.** Every element fades up the same way, which reads as "template". On slow phones content appears late (several screenshots caught pages washed out mid-fade). | Global |
| A7 | **Cliché copy:** "We saved you a seat", "Grow together, close to home", "Partner with what God is doing", "Stay close through the week", "Welcome home". | Visit, Groups, Give, Home |

### B. UX problems
| # | Finding | Impact |
|---|---|---|
| B1 | **Know Jesus**, the most important page, is **7 identical cards** that read like a terms-and-conditions list. The response form is about 6 screens down on mobile. | Weakens the gospel's emotional impact; responses get missed |
| B2 | **Mobile "I want to…"** is 5 full-width cards, about 1,000px of scrolling before today's devotional. | Pushes the daily content too far down |
| B3 | **Plan a Visit form** asks for 8 fields. A first-time visitor only needs name and WhatsApp. | Fewer people will finish it |
| B4 | **Too many "coming soon" signals:** a grey "Video coming soon" box, "Online giving is coming soon", "Ichibemba version coming soon", "Draft" badges on devotionals, and a blank map frame in the preview. | The site feels unfinished |
| B5 | **Navigation is flat:** 7 equal links plus Give plus the theme toggle. Know Jesus has the same weight as Privacy-level pages. The phone menu is a small dropdown. | Harder to scan; the main actions don't stand out |
| B6 | **Hero on phones:** the small label wraps to 2 lines and the address wraps to 3, pushing the service details below the first screen. | Key information is lost |
| B7 | **Sermons:** half the page is the flyer image, then one sermon with an empty grey video box. | Looks empty |
| B8 | **Repetition:** the mission statement is the About page title *and* the large footer text *and* the home hero line. | Diluted |
| B9 | **No "this Sunday" information.** Only "Every Sunday 8:00 AM": no date, countdown, "Add to calendar", or invite-a-friend option. | Misses the main conversion moment |

### C. Bugs found during the audit (fix first)
| # | Bug | Detail |
|---|---|---|
| C1 | **Hydration mismatch on every page load** ("1 issue" badge in dev) | The scroll-reveal script marks elements before React has taken over the page. React 19 also checks extra attributes, so the earlier attempted fix (switching from a class to a data attribute) didn't work. Fix: CSS scroll-driven animations (no JS), or start observing only after the page has hydrated. |
| C2 | Page transition error: *"Transition was aborted because of invalid state"* | Happens when navigating quickly. Guard the page transition, or limit it to the main content area. |
| C3 | Google Maps embed blank in the preview | Verify in a real browser. Add a static map image as a fallback. |
| C4 | Draft badges visible to the public | Hide them in production, or show them only to staff. |

---

## 3. Design direction: **"The Street & the Sanctuary"**

LIT does two things: it **proclaims on the streets** and it **nurtures people in the Word**. Give each its own visual voice, matching the plan's *Go* and *Grow* pillars.

| | **The Street** (proclaim · invite · go) | **The Sanctuary** (read · pray · grow) |
|---|---|---|
| Used for | Hero, Know Jesus, events, outreach, invites, calls to action, sermon series | Devotionals, scripture, prayer, the journal |
| Type | **Condensed bold sans in capitals** (e.g. *Barlow Condensed* or *Oswald* 700), echoing the flyers and signboards | **Fraunces serif** (as now), larger and quieter |
| Colour | **LIT green, signboard white, ribbon red, flyer yellow**: saturated and high-contrast | Warm paper, charcoal ink, flame accent only |
| Shapes | Signboard panels, ribbon banners, slightly tilted "held sign" cards, hard edges | Soft margins, no cards, generous whitespace |
| Motion | Energetic and purposeful: flame ignites, signs swing in, ribbons unfurl | Almost still: gentle fades, a reading progress bar |

### Signature elements (what makes it unmistakably LIT)
1. **`<Signboard>`:** scripture shown exactly like the physical street signs (green panel, bold white capitals, verse reference in a white strip). Used for featured verses, section dividers and **WhatsApp share images**, so online sharing looks like the street ministry.
2. **`<Ribbon>`:** the red flyer ribbon for series titles, announcements and "This Sunday".
3. **The flame as a system:** in place of generic lines and bullets. It marks progress (devotional streak: *"Keep the fire burning", Leviticus 6:13*), active navigation and steps in the gospel page.
4. **Unified photo treatment:** a duotone filter (charcoal + flame, or green) so mixed-quality phone photos look like one family. **Cut-out portraits** of the Reverend and elders, as on the flyers.
5. **A local layer:** a Bemba greeting (*Mwaiseni*, "Welcome") beside the English, an illustrated **Kitwe map** with the 4 cell-group areas, kwacha amounts, Copperbelt references.
6. **Motion with meaning**, used sparingly. Remove the fade-up from most elements and keep a few signature moments:
   - **Know Jesus "scarlet → snow":** as you scroll the gospel, the background shifts from deep scarlet to clean white (Isaiah 1:18). This is the site's signature moment.
   - **Flame ignite** on the hero and on "I prayed this prayer".
   - **Signboards swing in** like a sign being raised.

---

## 4. Page-by-page plan

### Home
- **Hero, "This Sunday" signboard:** the Reverend cut-out on green with yellow condensed type, as on the flyer, plus the current series ribbon, **this Sunday's actual date and a countdown**, and buttons for **Add to calendar** and **Invite a friend on WhatsApp**. Mwaiseni greeting. On phones the service time and place sit within the first screen.
- **"I want to…" chooser:** replace the 5 tall cards with one sentence and tappable options (*I want to → follow Jesus · get baptised · receive prayer · find a group · serve*). About 120px tall on phones instead of 1,000px.
- **Today's word (Sanctuary):** paper-style, no card frame, the verse in large serif, a "Day X of 28" flame trail.
- **"Find us on the streets" (Street):** a row of signboards and outreach photos, the next outreach date, and "Join the outreach team".
- **Testimonies:** 2–3 short stories with photos (collected with consent).
- **Cell groups map** teaser.

### Know Jesus (highest priority)
- A **7-chapter scroll story**, one idea per screen, with the **scarlet → white** background change. Each chapter shows its verse as a **Signboard**.
- **Sticky progress**: 7 flame dots that light up as you go.
- An **always-reachable response button** (a sticky bar on phones: "I prayed / I have questions").
- After the salvation prayer, the flame ignites, then a short response form with **name and WhatsApp only**.
- An English/Bemba switch, once the translation is ready.

### Devotional
- **Reading mode:** Sanctuary voice, larger serif, no card frame, a reading progress bar.
- **Flame trail calendar:** 4 weeks × 7 days, with "Mark as read" saved on the phone, a gentle streak, and catch-up.
- Space ready for **audio devotionals** (elders' voice notes).
- Draft badges shown to staff only.

### Plan a Visit
- **"Your first Sunday at LIT" timeline:** 7:45 arrive and get welcomed → 8:00 worship → the Word → prayer ministry → stay for fellowship. Replaces the 4 identical cards.
- A **photo of Havemore Restaurant** with a static map fallback.
- A **form with 2 required fields** (name, WhatsApp); everything else behind "Add details (optional)".
- **Add to calendar** and **WhatsApp us now** buttons.

### Cell Groups
- An **illustrated Kitwe map** with pins for Chimwemwe, Riverside, Ndeke and Buchi. Tapping a pin shows the group.
- Each group card shows the meeting day, host area and leader photo (once available), not "To be announced".
- "Not sure which? Tell us your area" → WhatsApp message.

### Sermons
- **Series-first:** the series ribbon header, then the list of parts.
- **No empty grey boxes:** use the flyer as the video poster. Show Watch/Listen only when media exists.
- Short-clip strip (vertical videos) for social-style sermon clips.

### Prayer
- Sanctuary voice. **Category chips** in place of the dropdown, privacy reassurance next to the button, and a calm confirmation ("We're praying for you", with a soft flame).

### Give
- Lead with **what giving does** (outreach, the sanctuary building, missions) with real numbers (e.g. people reached on the streets this year).
- "How to give today" (mobile-money number, once provided) in place of the large "coming soon" card.

### About
- **Story timeline** (founding → Havemore → streets of Kitwe).
- The Reverend's **cut-out portrait** and a short bio. Elders' portraits.
- Beliefs as a numbered **creed** in serif.
- Use the mission statement once (hero), not three times.

### Global
- **Navigation:** `Visit · Know Jesus · Watch · Grow ▾ (Devotional, Cell Groups, Prayer) · About` + **Give**. On phones, a **full-screen menu** with large serif links, the service time and a WhatsApp button.
- **Phone action bar** (bottom, appears after scrolling): *Visit · Watch · WhatsApp*.
- **Footer:** shorter, with the service time, the WhatsApp link and the signboard verse of the week.
- **Copy pass:** rewrite headings in LIT's voice, using scripture and the street language from the signs (e.g. Visit: *"Come as you are. Sunday, 8 AM."*; Groups: *"Church doesn't end on Sunday in Chimwemwe."*).

---

## 5. Roadmap

| Phase | Scope | Effort |
|---|---|---|
| **A. Fix & foundations** | Bugs C1–C4; two-voice tokens; add a condensed display font; build `Signboard`, `Ribbon`, `FlameMarker` and a duotone photo component; navigation regrouping, full-screen phone menu; reduce scroll reveal to signature moments only | 1–2 days |
| **B. Signature moments** | Know Jesus scroll story (scarlet → snow); new home hero with Sunday date and countdown; "I want to…" chooser; devotional reading mode and flame trail | 2–3 days |
| **C. Page rebuilds** | Visit timeline and short form; Groups map; series-first Sermons; Give; About; Prayer chips; copy pass | 2–3 days |
| **D. Content-dependent** | Reverend and elders cut-outs; real photos (worship, venue, outreach); testimonies; Bemba strings; leader names; giving numbers | When content arrives |

**Content to collect from LIT:**
- the Reverend's portrait (plain background, for cut-out)
- 15–20 photos (worship, congregation, outreach, Havemore venue, signboards)
- 3 testimonies, with consent
- Bemba translations of greetings and the gospel steps
- cell group leaders and meeting days
- mobile-money giving number

---

## 6. How we'll know it worked
- **Recognition test:** with the logo hidden, someone from LIT recognises the site as theirs within 5 seconds.
- **Phones:** service time, place and a main button visible on the first screen at 375px wide.
- **Know Jesus:** the response option reachable in 1 tap from any point on the page.
- **Plan a Visit:** 2 required fields or fewer.
- **Performance** on a mid-range Android phone: page loads with the main content showing in under 2.5 seconds, and no motion that delays content.
- **Zero hydration or console errors.**

## 7. Decisions needed
1. Approve the **"Street & Sanctuary"** direction (or ask for alternatives).
2. Pick the condensed font for the Street voice: **Barlow Condensed** (cleaner, modern) or **Oswald** (closer to the flyers).
3. Which to build first after Phase A: **Know Jesus** (evangelism impact) or the **Home hero** (first impression)?

---

## 8. Progress log

**12 Oct 2026: approved.** Direction: "Street & Sanctuary". Street font: **Oswald**. First signature page: **Know Jesus**.

**Phase A: done**
- C1 fixed: scroll reveal is now pure CSS (scroll-driven `animation-timeline: view()`), with no JavaScript and no hydration mismatch. Browsers without support show content immediately.
- C2 fixed: `<ViewTransition>` replaced by a CSS fade in `app/template.tsx`. The fade uses `backwards` fill so no transform lingers to break `position: fixed`.
- C3: map now has a styled "Open in Google Maps" fallback under the iframe.
- C4: draft badges hidden in production (show with `NEXT_PUBLIC_SHOW_DRAFTS=true`).
- Oswald added (`text-street-*` utilities); Street tokens: scarlet, snow, ribbon, flyer-yellow.
- New components in `src/components/street.tsx`: `Signboard`, `Ribbon`, `FlameMarker`, `Flame`.
- Navigation regrouped: Visit · Know Jesus · Watch · Grow ▾ · About · Give. Full-screen phone menu showing the service time and a WhatsApp button.
- *Deferred to the Home phase:* duotone photo component.

**Phase B, Know Jesus: done**
- Scarlet intro ("COME AS YOU ARE." in Oswald, Isaiah 1:18 ribbon).
- 7 full-screen chapters, each with a street Signboard (white board for "White as snow", red for "Receive the Holy Spirit").
- Background washes **scarlet → snow** while reading chapter 3 ("Jesus died for you"); text colour flips automatically.
- Flame progress rail (a strip under the header on phones, a pill on desktop); tap a flame to jump to that chapter.
- Prayer moment: "I prayed this prayer" makes a flame ignite and shows a welcome message, then "Tell LIT I prayed" scrolls to the form with the answer pre-selected. "I have questions" pre-selects that option.
- Sticky "Ready to respond to Jesus?" bar (hidden on the intro and when the form is visible).
- Response form: decision chips, then **2 required fields** (name, WhatsApp), with optional details behind "+ Add more details".

**Next:** Home hero ("This Sunday" signboard with date and countdown, "I want to…" chooser), then devotional reading mode and flame trail.
