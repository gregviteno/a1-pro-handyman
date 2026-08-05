# 08 — Westchester Launch Plan (ACTIVE)

**This is the current source of truth for campaign #1.** It supersedes `07-westchester-rockland-bronx-campaign.md` on budget grounds: `07` specced three counties at $12/day, and the owner's actual budget is **$10/day maximum**. At $10/day a 3-county spread produces too few clicks per market to learn anything. `07` is left untouched and becomes the reference for the eventual multi-county expansion.

Like `07`, this file **references** the original playbook (`README.md` + `01`–`06`) for anything unchanged — tracking setup, funnel, copy rules, optimization cadence — and only spells out what's different.

**Prereq:** tracking is live and verified — all 4 conversion actions confirmed firing via GTM as of 2026-07-20. No tracking work needed before launch.

---

## The math that drives every decision

$10/day = ~$300/month. Handyman urgency CPCs in Westchester run roughly $6–15.

| | |
|---|---|
| Avg CPC assumption | ~$8 |
| Clicks/month | **~37** (~1.2/day) |
| Landing page conversion rate (high-intent local service) | 10–15% |
| Expected leads/month | **3–6** |

**The enemy at this budget is spread, not creative quality.** Every setting below is chosen to concentrate spend on searches most likely to produce a phone call today. This is also why campaign #1 is one county: the goal is to establish a real cost-per-lead in a single market, not coverage.

## What's different from `07`

| | `07` (3-county) | This launch |
|---|---|---|
| Campaign name | `A1 Handyman - Westchester/Rockland/Bronx - Urgency` | `A1 Handyman - Westchester - Urgency` |
| Locations | Westchester + Rockland + Bronx | **Westchester County NY only** |
| Budget | $12/day | **$10/day** |
| Bronx landing-page stopgap | Bronx keywords → `manhattan-handyman.html` | N/A — Bronx not targeted |
| Location Insertion ad customizer | Required (spans 3 counties) | **Not needed** — single county, so `03`'s Westchester headlines work verbatim |
| County-specific sitelinks | Westchester + Rockland + Bronx/NYC | Just the five originals from `03` |
| Geo negatives | 8 adjacent terms | **13** — every neighboring market now excluded, incl. Rockland and Bronx |

## Ad group structure — a flagged trade-off

Two ad groups (`Same-Day / Emergency` + `High-Value Repairs`), per the owner's decision. Note the cost: ~37 clicks/month splits to roughly **24 / 13**. Mitigations built into this plan:

- AG2's keyword list is cut from `04`'s 10 keywords to **7** — the vaguest and least repair-intent terms dropped
- AG2 bids sit ~20% below AG1, so the urgency group wins more of the shared budget

**Expect to need 8–10 weeks to read results confidently, not the 4–6 in `06`.**

## Landing pages — message match, not page quality

All candidate pages (`same-day-repairs`, `emergency-handyman`, `westchester-handyman`, `drywall-repair`, `door-window-repair`) carry a hero-level `data-lead-form` and the same header call menu. Conversion structure is identical across them, so Final URLs are chosen purely for **message match**.

This corrects `04-google-ads-editor-import.csv`, which pointed every Ad Group 1 keyword at `westchester-handyman.html` regardless of whether the search said "emergency" or "same day". Now an "emergency handyman" search lands on the emergency page.

---

## Campaign settings

Campaign name is deliberately kept as **`A1 Handyman - Westchester - Urgency`** — it matches the campaign column already in `05-negative-keywords.csv`, so that file imports as-is with no edits.

| Setting | Value |
|---|---|
| **Campaign name** | `A1 Handyman - Westchester - Urgency` |
| **Type** | Search only — Search Partners OFF, Display Network OFF |
| **Locations** | Westchester County, NY — **"Presence"**, not "Presence or interest" |
| **Language** | English |
| **Budget** | **$10.00/day** |
| **Bidding** | **Manual CPC**, enhanced CPC OFF |
| **Ad schedule** | Mon–Fri 08:00–19:00; Sat 08:00–16:00; Sun 08:00–16:00 (Eastern) |
| **Device bid adj.** | Mobile **+20%**, Desktop **−20%**, Tablet **−50%** |

> **Creation-flow trap:** the guided campaign wizard (the "What's your business name?" screen) funnels toward Smart / Performance Max campaigns, which do not expose manual CPC, ad schedule, or the Presence location option. Back out and choose **"Create a campaign without a goal's guidance" → Search**.

**Why Manual CPC:** automated strategies (Maximize Conversions, tCPA) need ~15–30 conversions/month to function; this campaign will produce 3–6. Manual also prevents a single junk click from eating a whole day's budget. Revisit at the first budget increase.

**Why this ad schedule:** it matches the hours someone actually answers the phone. At ~1 click/day, a missed call is a whole day's spend gone — this is the single biggest lever on wasted budget, ahead of anything in the ad copy.

---

## Ad Group 1 — `Same-Day / Emergency`

Urgency intent. Should carry ~two-thirds of spend. Display path: `/Westchester` `/Same-Day`

| Keyword | Match | Max CPC | Final URL |
|---|---|---|---|
| `emergency handyman` | Exact | 10.00 | `/emergency-handyman.html` |
| `emergency handyman` | Phrase | 9.00 | `/emergency-handyman.html` |
| `emergency handyman near me` | Phrase | 9.00 | `/emergency-handyman.html` |
| `urgent handyman` | Phrase | 8.00 | `/emergency-handyman.html` |
| `same day handyman` | Exact | 10.00 | `/same-day-repairs.html` |
| `same day handyman` | Phrase | 9.00 | `/same-day-repairs.html` |
| `same day handyman near me` | Phrase | 9.00 | `/same-day-repairs.html` |
| `handyman available today` | Phrase | 8.00 | `/same-day-repairs.html` |
| `same day handyman westchester` | Phrase | 9.00 | `/westchester-handyman.html` |
| `handyman westchester` | Phrase | 8.00 | `/westchester-handyman.html` |
| `handyman westchester ny` | Phrase | 8.00 | `/westchester-handyman.html` |

> **`handyman near me` is deliberately held back from launch.** It is the highest-volume term in the set and would consume most of $10/day on its own, while pulling in low-ticket jobs (TV mounts, IKEA assembly) that the negative list only partly filters. Add it in week 3 **only if the campaign is underspending** — see Optimization below.

## Ad Group 2 — `High-Value Repairs`

Specific-repair intent, higher ticket, lower urgency. Bids ~20% under AG1 so it doesn't outbid the urgency group for shared budget. Display path: `/Home-Repairs` `/Westchester`

| Keyword | Match | Max CPC | Final URL |
|---|---|---|---|
| `drywall repair` | Exact | 7.50 | `/drywall-repair.html` |
| `drywall repair near me` | Phrase | 7.00 | `/drywall-repair.html` |
| `ceiling repair` | Phrase | 6.00 | `/drywall-repair.html` |
| `water damage repair` | Phrase | 7.00 | `/drywall-repair.html` |
| `door repair near me` | Phrase | 6.00 | `/door-window-repair.html` |
| `window repair near me` | Phrase | 6.00 | `/door-window-repair.html` |
| `handyman for repairs` | Phrase | 6.00 | `/services.html` |

**Cut from `04`'s list** to keep this group tight: `door installation` (install intent competes with door companies at much higher CPC), `home repair services` (too vague), `carpentry repair near me` (negligible volume in this geo).

Both ad groups are in **`09-westchester-import-keywords.csv`**, ready for Google Ads Editor.

---

## Negative keywords

1. **Import `05-negative-keywords.csv` unchanged** — 45 junk/low-ticket negatives; the campaign name column already matches.
2. **Import `10-westchester-geo-negatives.csv`** — 13 adjacent-geo terms (all Phrase):

```
bronx · brooklyn · queens · staten island · manhattan · nyc · new york city
rockland · putnam · nassau · long island · new jersey · connecticut
```

This list is longer than `07`'s because Westchester-only targeting excludes every neighboring market, including Rockland and Bronx. These catch users physically *in* Westchester searching for work in another county — "Presence" targeting alone does not filter that.

---

## Ads & assets

Two RSAs per ad group. Copy comes from `03-ad-copy-and-assets.md` **largely as-written** — since this is single-county, the Westchester-specific headlines are usable verbatim and no Location Insertion customizer is needed. Pin nothing except optionally one urgency headline to position 1.

Campaign-level assets (free, and disproportionately valuable at low budget):

- **Call asset:** (914) 693-0009, call reporting ON, asset schedule matched to the campaign ad schedule above
- **Sitelinks:** the five from `03` — Same-Day Repairs, Emergency Repairs, Free Second Opinion, Get a Fast Quote, Our Service Area. The Rockland and Bronx/NYC sitelinks from `07` are **not** used.
- **Callouts:** the 8 from `03`
- **Structured snippet:** Services header, values per `03`
- **Location asset:** link the Google Business Profile

Copy rules from `03` still bind — no "guaranteed same-day," no fake urgency counters.

---

## Build sequence

1. Create the Search campaign via **"without a goal's guidance"**; apply the settings table (location Presence, $10/day, Manual CPC, ad schedule, device adjustments, partners off).
2. Import `09-westchester-import-keywords.csv`, `10-westchester-geo-negatives.csv`, and `05-negative-keywords.csv` via Google Ads Editor. Review, then post.
3. Build the two RSAs per ad group from `03`'s copy.
4. Attach campaign-level assets; enable call reporting.
5. Leave the campaign **paused** until every verification check below passes.

## Verification before unpausing

- [ ] Google Ads "Diagnostics" shows no disapproved ads or broken Final URLs
- [ ] Every Final URL returns HTTP 200 (18 keywords across 5 distinct pages)
- [ ] `emergency-handyman.html`, `same-day-repairs.html`, `westchester-handyman.html` each load fast on a real mobile device with the hero lead form visible without scrolling
- [ ] Submit one live test form → confirm the `thank-you.html` redirect fires and the Formspree email arrives
- [ ] In GTM Preview, confirm `form_submit` and `phone_call_click` fire on a Final URL page reached via a `?gclid=` test URL (verifies `js/tracking.js` still captures ad attribution)
- [ ] Confirm Formspree free-tier submission headroom for the month
- [ ] Location targeting reads **"Presence"** — re-check, the UI silently defaults to "Presence or interest"
- [ ] Ad schedule saved in **Eastern**, not the account default timezone

## Optimization checkpoints

- **Week 1** — daily search-terms review; add negatives aggressively. Expect ~8 clicks total.
- **Week 3** — if the campaign is *underspending* (< $8/day actual), add `handyman near me` Phrase at $7.00 to AG1. If it's spending in full, leave it out.
- **Week 8–10** — first honest CPL read. Compare AG1 vs AG2 cost-per-lead; shift bids toward the winner, or pause AG2 entirely and consolidate if the two-group split proved too thin.
- **After 15–30 conversions** — consider switching to Maximize Conversions, and revisit `07` for the Rockland expansion.

---

## Appendix A — Screen-by-screen build walkthrough (Google Ads UI)

Either objective path works: **"Create a campaign without guidance" → Search**, or **Leads → Search**. They produce the same campaign. The only difference is the bidding default — the Leads path defaults to Conversions focus and you must change it (see step 4).

**1. Objective.** "Create a campaign without guidance," or Leads. If Leads, the conversion-goals table should already show *Contacts*, *Phone call leads*, and *Submit lead forms* at $50 each (account defaults). A ⚠️ on *Phone call leads* is expected — "Call from Ads" can't record anything until a call asset exists and the campaign has run.

**2. Campaign type.** Search.

**3. Campaign name + goal methods.** Name it `A1 Handyman - Westchester - Urgency` exactly (`05` and `10` key on this string). On "Select the ways you'd like to reach your goal," **leave all five checkboxes unchecked** — they only pre-populate asset prompts and don't affect bidding or serving. Checking "Phone calls" inlines a stripped-down call-asset step that doesn't expose the asset-level schedule you need.

**4. Bidding — the screen that matters.**
1. "What do you want to focus on?" → **Clicks**
2. Click the small link **"Or, select a bid strategy directly"** (labeled *not recommended*)
3. Select **Manual CPC**
4. Uncheck **Enhanced CPC** if offered

> **Fallback if Manual CPC isn't offered** (the Leads path sometimes suppresses it): use **Maximize clicks** with **"Set a maximum cost-per-click bid limit" = $9.00**. The cap prevents one auction from eating a meaningful slice of a $10 day. Cost: per-keyword bids from `09` no longer apply, so the AG1/AG2 bid weighting is lost — compensate by **pausing AG2 for the first two weeks** so the urgency group gets clean data.

**5. Campaign settings.**
- **Networks:** uncheck **both** Search partners and Display Network. Display is checked by default.
- **Locations:** "Enter another location" → `Westchester County, New York` → Target. Then expand **Location options** → select **"Presence: People in or regularly in your targeted locations."** Defaults to "Presence or interest" — most-missed setting in the build.
- **Languages:** English. **Audience segments:** skip.
- **More settings → Ad schedule:** Mon–Fri 8:00 AM–7:00 PM; Sat 8:00 AM–4:00 PM; Sun 8:00 AM–4:00 PM. Saves in *account* timezone — confirm the account is set to Eastern first.

**6. Keywords and ads.** Create both ad groups. The UI won't accept per-keyword Final URLs during creation — set an ad group default now and apply the per-keyword URLs from `09` afterward (or skip the UI and do this step in Google Ads Editor, which is much faster).
- `Same-Day / Emergency` → default URL `https://a1prohandyman.com/same-day-repairs.html`
- `High-Value Repairs` → default URL `https://a1prohandyman.com/drywall-repair.html`

> **One RSA per ad group, not the two in `03`.** That guidance assumed a larger budget. At ~37 clicks/month Google will never accumulate enough impressions to pick a winner, and a second RSA only splits delivery. Add the challenger at the first budget increase.

**7. Assets.** Call asset (914) 693-0009 with call reporting ON; `03`'s five sitelinks, 8 callouts, Services structured snippet; GBP linked as location asset.

**8. Budget.** $10.00/day. Ignore the "you could get X more clicks at $25/day" nudge.

**9. Review → Publish → immediately pause.** Nothing serves until the verification checklist passes.

### Not available during creation — do these after publishing

| What | Where |
|---|---|
| Device bid adjustments (Mobile +20%, Desktop −20%, Tablet −50%) | Campaign → Settings → Devices |
| Negative keywords (58 total) | Campaign → Keywords → Negative keywords → import `05` + `10` |
| Per-keyword Final URLs | From `09` — so "emergency handyman" lands on the emergency page, not the ad group default |

---

## Next expansion phase

Once CPL is known and stable, the first expansion is **Rockland** (cheaper CPCs, real landing page at `rockland-handyman.html`), then Bronx — which needs `bronx-handyman.html` built first, mirroring `rockland-handyman.html`'s structure. See `07` for the multi-county campaign settings and `02-campaign-playbook.md` for the geo-clone mechanics.
