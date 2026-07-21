# 06 — Launch & Optimization Checklist

## Pre-launch QA (don't skip a single box)

**Tracking (from `01-tracking-setup.md`)**
- [ ] GTM container installed on the live site; real `GTM-XXXXXXX` in place and uncommented
- [ ] GA4 property live; Google Ads ↔ GA4 linked
- [ ] Conversion actions created: **Lead — Form Submit** (One), **Lead — Phone Call** (One), **Calls from ads**
- [ ] **Conversion Linker** tag firing on all pages
- [ ] Test lead submitted → landed on `thank-you.html` → `lead_thank_you` fired → conversion recorded in Google Ads
- [ ] Test **phone tap** → `phone_call_click` fired → conversion recorded
- [ ] Test lead **email actually arrived** from Formspree

**Campaign (from `02` + `03` + `04` + `05`)**
- [ ] Campaign type Search; **Search Partners OFF, Display OFF**
- [ ] Location = **Westchester County NY**, option set to **"Presence"** (not "Presence or interest")
- [ ] Budget $5–10/day; **Manual CPC** (max ~$8–10)
- [ ] Ad schedule Mon–Sat 6 AM–6 PM (Eastern)
- [ ] Both ad groups built; ~10 keywords each; Phrase/Exact only
- [ ] Negative keyword list (`05`) applied at campaign level
- [ ] 2 RSAs per ad group; final URLs correct per landing-page map
- [ ] **Call asset** added with **call reporting ON**; sitelinks, callouts, structured snippets, location asset all added
- [ ] Every final URL loads fast and shows the 3-step form (open each on your phone)
- [ ] Billing set; conversion tracking status shows "Recording" or "Eligible"

**Go live:** enable the campaign. First impressions usually appear within an hour; ads may sit "under review" up to 1 business day.

---

## What "success" looks like at $5–10/day

You're validating, not scaling. Over the first 30–45 days expect roughly:

| Metric | Rough target (validation phase) |
|---|---|
| Clicks | ~30–75 / month |
| CTR | 6%+ (with all extensions) |
| Leads (form + call) | ~4–9 / month |
| Cost per lead (CPL) | Establish the baseline — no "good/bad" yet, just measure |
| Lead → appointment rate | Track from your side (this is the number that unlocks scaling) |

**The decision you're buying:** once you know CPL and how many leads become paying jobs (and their average value), you know whether $1 in becomes >$1 out. If yes → climb the budget ladder. That's the whole point of this phase.

---

## Optimization cadence

### First 2 weeks — every 2–3 days (15 min)
1. **Search terms report** → add irrelevant/low-ticket terms to the negative list. This is the #1 budget-saver. Watch `handyman near me` closely.
2. Promote strong search terms to their own keyword (Phrase/Exact) if they convert or show clear intent.
3. Confirm conversions are still recording (Goals → Conversions).
4. Pause any ad disapprovals; fix and resubmit.

### Weeks 3–6 — weekly (20 min)
1. Keep pruning search terms.
2. **Ad strength:** if an RSA is "Poor/Average," add/swap headlines from `03` to reach "Good/Excellent."
3. **Ad schedule / device:** if data shows mornings or mobile convert best, add bid adjustments (e.g. +20% mornings, +20% mobile).
4. **Keyword pruning:** pause keywords that spent ~2–3× your target CPL with zero conversions.
5. **Landing page:** check that leads are usable quality; if a page underperforms, test the alternate (e.g. `same-day-repairs.html` vs `westchester-handyman.html` for Ad Group 1).

### Monthly — decision point
1. Calculate CPL and lead→job value.
2. If profitable and you have ~15–30 conversions → **advance the budget ladder** (`02`): raise budget, then move to **Maximize Conversions / Target CPA**.
3. When ready to grow reach → **clone the campaign into Rockland (Nyack) and Fairfield**, each pointed at its own county page and phone number (mechanics in `02-campaign-playbook.md`).

---

## Red flags & quick fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Budget gone by mid-morning, few clicks | CPCs high / bids too high | Lower max CPC; tighten to Exact match on top terms |
| Clicks but zero leads | Wrong-intent traffic or LP mismatch | Prune search terms; check the LP loads & form works on mobile |
| Impressions but no clicks | Weak ad strength or no extensions | Improve RSA to "Good+", confirm all assets active |
| Conversions not recording | Tag/linker issue | Re-run the `01` verification; check Conversion Linker + GTM triggers |
| Lots of low-ticket calls (TV mount, assembly) | Negative list gaps | Add those terms to `05`; reinforce "repair" language in ads |
| "Limited by budget" warning | Expected at this budget | Fine for now; it's the signal to climb the ladder once CPL is proven |

---

## Handling the leads (the part that actually makes money)

The ads only fill the top of the funnel. Protect your return by:
- **Speed to lead:** call form-fills back **within minutes** during business hours (the thank-you page promises a fast callback). Same-day intent goes cold fast.
- **Don't try to close on the phone** — book the on-site visit. In-person is where the higher-ticket work (and the trust) happens.
- **Use the "free second opinion" hook** for anyone shopping a big contractor quote — it's your best higher-ticket opener.
- **Note the source:** each lead email carries the UTM/keyword/`gclid`, so you can tell which searches turn into real jobs and feed that back into bids and negatives.
