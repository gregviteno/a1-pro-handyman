# A1 Pro Handyman — Google Ads Playbook (Start Here)

**Goal:** turn on paid search so the crew gets a steady flow of inbound reach-outs — form fills, phone calls, quote requests, and "second opinion" inquiries — for **local repairs** in the affluent NY/CT suburbs. We are **not** trying to close on the phone. The job of this campaign is to **fill the calendar with appointments**; the real selling happens **in person, on the job**.

**Angle:** urgency ("same-day / today / emergency") + repairs that tend to **open the door to bigger tickets** (drywall & ceiling from water damage, doors & windows, general home repair). We deliberately steer *away* from low-ticket one-offs (TV mounting, furniture assembly) using negative keywords.

**Launch market:** **Westchester County, NY only.** Once we know our real cost-per-lead, we clone the campaign into **Rockland (Nyack)** and **Fairfield County, CT** (see the budget ladder below).

---

## Read this before you spend a dollar: the budget reality

At **$5–10/day** you are running a **validation budget**, not a "fill every day" budget. Here's the honest math for these markets:

| Assumption | Value |
|---|---|
| Handyman search CPC (affluent NY suburbs) | ~$6–15 per click |
| Clicks at $5–10/day | **~1–3 clicks/day** (~30–75/month) |
| Strong urgency landing-page conversion rate | ~8–12% |
| Expected leads (form + call) | **~4–9 quality leads/month** |

So the first 30–45 days are about proving three numbers: **cost-per-click, cost-per-lead, and lead→appointment rate.** Once those are known and the funnel is proven, you scale budget to actually hit near-daily appointments.

> **Do not judge this campaign on "did it book someone today."** Judge it on cost-per-lead and lead quality over the first ~15–30 leads. Then turn up the budget.

### Budget ladder

| Phase | Daily budget | Trigger to advance | What changes |
|---|---|---|---|
| **0 — Validate** | **$5–10/day** | Launch | Westchester only, Manual CPC, tight keywords |
| **1 — Prove** | $15–25/day | ~15–30 leads logged & CPL known | Same campaign, raise budget, keep optimizing search terms |
| **2 — Scale** | $25–50+/day | CPL is profitable vs. avg job value | Move to Smart Bidding (Max Conversions/tCPA); **clone campaign** into Rockland (Nyack) + Fairfield with each geo pointing at its own county page |

---

## The funnel (how a click becomes an appointment)

```
Google Search ("same day handyman westchester")
        │
        ▼
  Google Ad  ─── call asset ──►  📞 Call (914) 693-0009   ──► phone_call_click event
        │                                                        (Google-native call reporting)
        ▼
  Landing page (same-day-repairs / westchester-handyman / drywall-repair …)
        │        3-step form (name+address+email → project+photo+phone → best time)
        │        └── also: tel: click-to-call on every page (sticky mobile bar)
        ▼
  Form submit  ──► generate_lead event ──► Formspree (leads emailed) ──► redirect
        ▼
  thank-you.html  ──► lead_thank_you event ──► ✅ Google Ads CONVERSION fires here
        ▼
  Crew calls back → flat quote → same-day window when schedule allows → IN-PERSON CLOSE
```

**Every conversion signal already exists in the site's code** (`js/tracking.js` pushes `generate_lead`, `phone_call_click`, and `lead_thank_you`; UTM + `gclid` are captured on landing and written into each form). We are not building tracking from scratch — we are **activating** the placeholders already scaffolded in the site. See `01-tracking-setup.md`.

---

## What's in this folder & the order to use it

| # | File | Do this |
|---|---|---|
| 📖 | **README.md** (this file) | Understand the plan, budget, and funnel |
| 1 | **01-tracking-setup.md** | **Do this FIRST.** Create GA4 + Google Ads, build conversion actions, activate the site's tracking placeholders, verify they fire. **No spend until conversions are confirmed.** |
| 2 | **02-campaign-playbook.md** | Build the single Search campaign: settings, 2 ad groups, geo, bidding, ad schedule, landing-page map, negatives, budget |
| 3 | **03-ad-copy-and-assets.md** | Paste the responsive search ad copy + all extensions (call, sitelinks, callouts, snippets) |
| 4 | **04-google-ads-editor-import.csv** | Bulk-load the campaign, ad groups, and keywords via Google Ads Editor (optional shortcut) |
| 5 | **05-negative-keywords.csv** | Load the shared negative list (protects the budget; blocks low-ticket & junk) |
| 6 | **06-launch-and-optimization-checklist.md** | Pre-launch QA, go-live steps, and the week-by-week optimization routine |

---

## The one-campaign structure at a glance

**Campaign:** `A1 Handyman — Westchester — Urgency` · Search only · Westchester County NY (Presence) · $5–10/day · Manual CPC to start.

- **Ad Group 1 — Same-Day / Emergency** → urgency searches → LP `same-day-repairs.html` (Westchester-only swap: `westchester-handyman.html`)
- **Ad Group 2 — High-Value Repairs** → repair searches that open bigger jobs → LP `drywall-repair.html` / `door-window-repair.html` / `services.html`

Two ad groups, on purpose. Geography is handled by the campaign's location targeting, not by splitting ad groups — that keeps the tiny budget concentrated and the data readable.

---

## Key facts (used across all files — keep these consistent)

- **Business:** A1 Pro Handyman · `a1prohandyman.com`
- **Primary tracked phone (Westchester):** **(914) 693-0009**
- **Conversion page:** `https://a1prohandyman.com/thank-you.html`
- **Live dataLayer events:** `generate_lead`, `phone_call_click`, `lead_thank_you`
- **Landing pages:** `same-day-repairs.html`, `emergency-handyman.html`, `westchester-handyman.html`, `drywall-repair.html`, `door-window-repair.html`, `services.html`
- **Brand colors:** navy `#16324F`, orange `#F26A1B` (for any display/creative later)
