# 02 — Campaign Playbook

One Search campaign. Two ad groups. Built to protect a tiny budget and to attract **urgent, higher-ticket-opening** repair jobs in Westchester.

> Prereq: `01-tracking-setup.md` is done and a test lead showed up as a conversion. If not, stop and finish that first.

---

## Campaign settings (copy these exactly)

| Setting | Value | Why |
|---|---|---|
| **Campaign name** | `A1 Handyman — Westchester — Urgency` | |
| **Objective** | Leads (or "Create without a goal's guidance") | We optimize to our own conversion actions |
| **Campaign type** | **Search** | Intent-based; captures people actively looking |
| **Networks** | Search Network **ON**. **Search Partners OFF. Display Network OFF.** | Display/partners waste a small budget fast |
| **Locations** | **Westchester County, New York** only | Concentrate spend; expand later |
| **Location options** | **"Presence: People in or regularly in your targeted locations"** | **Critical.** The default "Presence or interest" shows your ads to people merely *interested* in Westchester (nationwide). Change it. |
| **Languages** | English (+ Spanish optional for the market) | |
| **Budget** | **$8/day** (within the $5–10 range) | ~$240/mo ceiling; Google may spend up to 2× on a given day but not more than 30.4× the daily over a month |
| **Bidding** | **Manual CPC** with a max CPC around **$8–10** (or "Maximize clicks" with a max-CPC cap while learning) | Smart Bidding needs conversion volume you won't have on day 1 |
| **Ad rotation** | Optimize for best-performing ads | |
| **Ad schedule** | **Mon–Sat, 6:00 AM–6:00 PM** (Eastern) | Same-day service must be deliverable when the ad shows; don't pay for 2 AM clicks |
| **Devices** | All. Consider **+15–25% mobile** bid adjustment | Same-day + calls skew mobile |
| **Start/end** | Start now, no end date | |

**Dayparting lean (optional, once you have data):** bid **up in the morning (6 AM–12 PM)** — the site's promise is "call before noon and we can usually be there today," so morning searchers are your best same-day fits.

---

## Ad group structure (2 groups — geo is handled by targeting, not by ad groups)

### Ad Group 1 — `Same-Day / Emergency`
**Intent:** "I need someone now." Highest urgency, highest intent.

**Landing page:** `https://a1prohandyman.com/same-day-repairs.html`
> **Westchester-only swap (recommended while the campaign is Westchester-only):** point this group at `https://a1prohandyman.com/westchester-handyman.html` instead — it has the same same-day funnel *plus* local town names (White Plains, Yonkers, New Rochelle, Scarsdale, Rye…), which lifts local relevance and Quality Score. Use `same-day-repairs.html` once you expand beyond one county. Alternative urgency page: `emergency-handyman.html`.

**Keywords** (Phrase + Exact only — no broad match):

| Keyword | Match |
|---|---|
| `same day handyman` | Phrase |
| `[same day handyman]` | Exact |
| `same day handyman near me` | Phrase |
| `emergency handyman` | Phrase |
| `[emergency handyman]` | Exact |
| `emergency handyman near me` | Phrase |
| `handyman available today` | Phrase |
| `same day home repair` | Phrase |
| `urgent handyman` | Phrase |
| `handyman near me` | Phrase |

> `handyman near me` (Phrase) is your volume driver but also your leakiest term — watch the search-terms report closely and negative anything low-ticket or out-of-scope.

### Ad Group 2 — `High-Value Repairs`
**Intent:** a specific repair that usually reveals a bigger job (water damage behind drywall, a door/frame that needs more than a fix, a punch-list that grows). These are your **higher-ticket openers.**

**Landing page (message-match by theme):**
- Drywall/ceiling terms → `https://a1prohandyman.com/drywall-repair.html`
- Door/window terms → `https://a1prohandyman.com/door-window-repair.html`
- General "home repair / handyman for repairs" → `https://a1prohandyman.com/services.html`
> If you want a single LP for simplicity, use `services.html` for the whole group. Message-matched pages usually convert better — split by final URL at the keyword level if you're comfortable.

**Keywords** (Phrase + Exact):

| Keyword | Match | Final URL |
|---|---|---|
| `drywall repair near me` | Phrase | drywall-repair.html |
| `[drywall repair]` | Exact | drywall-repair.html |
| `ceiling repair` | Phrase | drywall-repair.html |
| `water damage repair` | Phrase | drywall-repair.html |
| `door repair near me` | Phrase | door-window-repair.html |
| `window repair near me` | Phrase | door-window-repair.html |
| `door installation` | Phrase | door-window-repair.html |
| `home repair services` | Phrase | services.html |
| `handyman for repairs` | Phrase | services.html |
| `carpentry repair near me` | Phrase | services.html |

> **Keep both groups tight (~10 keywords each).** At $8/day, more keywords = fewer impressions each = slower, muddier data. Add winners from the search-terms report over time; don't front-load.

---

## Negative keywords (protect the budget & honor "not low-ticket")

Load the full list from **`05-negative-keywords.csv`** as a **campaign-level negative list** (or an account-level shared list you reuse when you expand). It blocks two things:

1. **Junk / non-buyers:** `diy`, `how to`, `youtube`, `jobs`, `hiring`, `salary`, `apprentice`, `license`, `certification`, `training`, `course`, `cheap`, `free`, `rental`, `home depot`, `lowes`, `taskrabbit`, `thumbtack`, `angi`, `franchise`, `resume`, `part time`…
2. **Low-ticket intents we don't want** (per the strategy): `tv mount`, `tv mounting`, `mount tv`, `furniture assembly`, `ikea`, `assemble`, `picture hanging`, `hang shelf`…

> Yes, the site *offers* TV mounting — but this campaign's job is to attract **repair jobs that open bigger tickets**, so we exclude the $89 one-offs on purpose. Revisit later if you ever want a dedicated low-ticket campaign.

**Add to negatives continuously.** Every 2–3 days for the first two weeks, open the **Search terms report** and negative anything irrelevant. This is the single highest-ROI habit on a small budget.

---

## Assets / extensions

Set these up in `03-ad-copy-and-assets.md` — at minimum: **Call asset** (with call reporting on), **Sitelinks** (incl. "Free 2nd Opinion"), **Callouts**, **Structured snippets**, and **Location asset** (Google Business Profile). Extensions are free, raise CTR, and take more of the results page — essential when budget is small.

---

## Bidding: two-phase plan

| Phase | Bid strategy | When |
|---|---|---|
| **Learning** | **Manual CPC** (max ~$8–10) or Max Clicks w/ CPC cap | Day 1 → ~15–30 conversions |
| **Scaling** | **Maximize Conversions**, then add a **Target CPA** once CPL is stable | After you have ~15–30 conversions/30 days |

Don't switch to Smart Bidding early — it needs conversion data to work, and starving it produces erratic spend.

---

## Budget ladder (repeat from README — the plan to actually fill the calendar)

| Phase | Daily | Advance when | Change |
|---|---|---|---|
| 0 Validate | **$5–10** | now | Westchester, Manual CPC |
| 1 Prove | $15–25 | 15–30 leads & CPL known | raise budget, keep pruning search terms |
| 2 Scale | $25–50+ | CPL profitable vs. job value | Smart Bidding + **clone campaign → Rockland (Nyack) + Fairfield**, each pointed at its own county page (`rockland-handyman.html`, `fairfield-handyman.html`) |

**Geo expansion mechanics (Phase 2):** duplicate this campaign twice in Google Ads Editor; change the **Location** to Rockland County (for Nyack) and Fairfield County CT respectively; change each ad group's **Final URL** to the matching county page; and swap the **Call asset** number (Rockland/NJ line, Fairfield `(203) 653-5066`). Keep the same keywords, negatives, and ad copy structure.
