# 07 — Westchester / Rockland / Bronx Campaign

This is a standalone launch spec for **one Search campaign covering three priority counties at once**: Westchester, Rockland, and Bronx (NY). It **references** the original playbook (`README.md` + `01`–`06`) for anything that doesn't change — tracking setup, funnel, copy rules, optimization cadence — and only spells out what's different here. Don't edit the original files to match this; they document the Westchester-only launch as it happened. Treat this file as the current source of truth for campaign settings going forward.

**Prereq:** tracking is already live and verified (see memory / `01-tracking-setup.md`) — all 4 conversion actions confirmed firing via GTM as of 2026-07-20. No tracking work needed before this launch.

---

## Why these three counties

Westchester, Rockland, and Bronx are the three highest-priority markets right now. Rockland and Bronx were originally slated for a later "clone the campaign" phase once Westchester proved itself — this file supersedes that sequencing and launches all three together in a single campaign from day one.

## What's different from the original Westchester-only plan

| | Original (`02`) | This launch |
|---|---|---|
| Campaign name | `A1 Handyman - Westchester - Urgency` | `A1 Handyman - Westchester/Rockland/Bronx - Urgency` |
| Locations | Westchester County NY only | Westchester County NY + Rockland County NY + Bronx County NY (all "Presence") |
| Budget | $5–10/day | **$10–15/day** (use $12/day to start) — same validation-phase logic, just sized for 3 counties instead of 1 |
| Max CPC | ~$8–10 | ~$8–12 |
| Ad Group 1 default LP | `westchester-handyman.html` | `same-day-repairs.html` (generic default) + county-modified keywords override to the matching county page |
| Next expansion phase | Rockland + Fairfield | Nassau, Putnam, Fairfield (Rockland/Bronx are already in from launch) |

Everything else — Ad Group 2 (`High-Value Repairs`), the negative-keyword strategy, the ad-copy rules, the optimization cadence, and the red-flags table — carries over unchanged from `02`/`03`/`06`.

---

## The Bronx landing-page gap

**There is no `bronx-handyman.html` on the site.** The existing regional pages are Westchester, Rockland, Nassau, Putnam, Fairfield, and Manhattan — Bronx isn't one of them.

**Decision for this launch:** route Bronx-targeted keywords to `https://a1prohandyman.com/manhattan-handyman.html`. It's the closest existing NYC-area page and its hero CTA already shows the NYC line, (212) 335-0360, instead of the Westchester/Rockland number. This is a stopgap, not a permanent fix — if Bronx volume or CPL looks promising after the validation phase, build a real Bronx page mirroring `rockland-handyman.html`'s structure and repoint these keywords to it.

---

## Campaign settings

| Setting | Value |
|---|---|
| **Campaign name** | `A1 Handyman - Westchester/Rockland/Bronx - Urgency` |
| **Campaign type** | Search only, Search Partners OFF, Display OFF |
| **Locations** | Westchester County, NY + Rockland County, NY + Bronx County, NY — **"Presence" option, not "Presence or interest"** |
| **Budget** | $12/day ($10–15 range) |
| **Bidding** | Manual CPC, max ~$8–12, while learning |
| **Ad schedule** | Mon–Sat, 6 AM–6 PM Eastern |
| **Devices** | All, consider +15–25% mobile bid adjustment |

**Location bid adjustments:** once ~15–30 leads are in and you can segment by location (Segment → Location in Google Ads), lean budget toward whichever county is cheapest/best-quality with a bid adjustment (e.g. +10–20%) rather than splitting into three campaigns. Keeps reporting simple on a small budget.

---

## Ad Group 1 — Same-Day / Emergency

**Default landing page:** `same-day-repairs.html` (no geo modifier in the keyword)

**County-modified keywords override the Final URL:**

| Keyword | Match | Final URL |
|---|---|---|
| `same day handyman` | Phrase | same-day-repairs.html |
| `[same day handyman]` | Exact | same-day-repairs.html |
| `same day handyman near me` | Phrase | same-day-repairs.html |
| `emergency handyman` | Phrase | same-day-repairs.html |
| `[emergency handyman]` | Exact | same-day-repairs.html |
| `emergency handyman near me` | Phrase | same-day-repairs.html |
| `handyman available today` | Phrase | same-day-repairs.html |
| `urgent handyman` | Phrase | same-day-repairs.html |
| `handyman near me` | Phrase | same-day-repairs.html |
| `handyman westchester ny` | Phrase | westchester-handyman.html |
| `same day handyman westchester` | Phrase | westchester-handyman.html |
| `handyman rockland ny` | Phrase | rockland-handyman.html |
| `same day handyman rockland` | Phrase | rockland-handyman.html |
| `handyman bronx` | Phrase | manhattan-handyman.html |
| `handyman bronx ny` | Phrase | manhattan-handyman.html |

> `handyman near me` has no geo modifier, so it depends entirely on the campaign's location targeting to stay relevant — this is the term most likely to leak impressions outside the three counties if the "Presence" option isn't set correctly.

**Ad copy — Location Insertion:** since this ad group spans three counties, add a **Location Insertion ad customizer** to 1–2 headlines (e.g. `Handyman in {LOCATION(City):Your Area}`) so Google can dynamically show the searcher's actual town/county instead of writing a headline per geo. Otherwise reuse the Ad Group 1 headlines/descriptions from `03-ad-copy-and-assets.md`, generalized — swap any Westchester-only phrasing (e.g. "Same-Day Handyman Westchester") for something that covers all three, like "Same-Day Handyman Near You" or "Westchester • Rockland • Bronx."

**Sitelinks — add county-specific ones** alongside the originals in `03`:

| Link text | Final URL | Description line 1 | Description line 2 |
|---|---|---|---|
| Westchester Service Area | `/westchester-handyman.html` | Serving Westchester | Same-day slots open |
| Rockland Service Area | `/rockland-handyman.html` | Serving Rockland | Same-day slots open |
| Bronx / NYC Service Area | `/manhattan-handyman.html` | Serving the Bronx & NYC | Same-day slots open |

## Ad Group 2 — High-Value Repairs

Unchanged from `02`/`03`/`04` — same keywords, same landing pages (`drywall-repair.html` / `door-window-repair.html` / `services.html`). This group is intent-based (a specific repair), not geo-based, so it doesn't need county variants.

---

## Negative keywords — add these to the shared list (`05`)

On top of the existing junk/low-ticket negatives, add adjacent-geo terms so `handyman near me` and similar phrase-match keywords don't leak into boroughs/counties we're not targeting yet:

```
brooklyn
queens
staten island
manhattan
nassau
long island
new jersey
connecticut
```

(`manhattan` is a negative even though Bronx traffic *lands* on `manhattan-handyman.html` — we don't want to bid on searches for Manhattan itself, since it isn't one of the three targeted counties.)

---

## Call asset

Keep **(914) 693-0009** as the campaign's Call asset number (matches the Westchester/Rockland pages and is already the number verified in the GTM conversion setup). Bronx searchers who click through to `manhattan-handyman.html` will see that page's own on-page number, (212) 335-0360, instead — that's fine, since `phone_call_click` tracking fires identically regardless of which number is tapped.

---

## Pre-launch checklist additions (on top of `06`)

- [ ] Location targeting set to all three counties with "Presence" (not "Presence or interest")
- [ ] Budget set to $12/day, not the original $8/day
- [ ] County-modified keywords added with correct Final URLs (table above)
- [ ] Adjacent-geo negatives added to the negative list
- [ ] `manhattan-handyman.html` loads fast and shows the 3-step form on mobile — this page now carries Bronx traffic too, not just Manhattan
- [ ] New sitelinks (Rockland, Bronx/NYC service area) added alongside the original ones

## Next expansion phase

Once this 3-county campaign is proven (CPL known, ~15–30 leads logged), the next clone targets are **Nassau, Putnam, and Fairfield County CT** — not Rockland (already live here). See `02-campaign-playbook.md`'s geo-expansion mechanics for how to clone a campaign into a new county.
