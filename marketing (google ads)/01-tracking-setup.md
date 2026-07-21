# 01 — Tracking Setup (do this FIRST, before any spend)

**Why first:** Google Ads optimizes toward whatever you tell it a "conversion" is. If tracking isn't live and verified, you're paying for clicks blind and the algorithm has nothing to learn from. **Do not launch the campaign until a test lead shows up as a conversion in Google Ads.**

**Good news:** the website already does the hard part. `js/tracking.js` (live on every page) captures the ad click (`gclid`, all UTMs) and pushes three events to the browser's `dataLayer`:

| Event | Fires when | Use it for |
|---|---|---|
| `generate_lead` | Any lead form is submitted | Secondary/observation conversion |
| `phone_call_click` | Any `tel:` link is clicked (incl. sticky mobile bar) | **Primary** — phone call intent |
| `lead_thank_you` | The `thank-you.html` page loads after a successful submit | **Primary** — completed lead |

The site's `<head>` (all pages) and `thank-you.html` already contain **commented-out placeholder tags** (`GTM-XXXXXXX`, `G-XXXXXXX`, `AW-XXXXXXX`, and a conversion tag `AW-XXXXXXX/YYYYYYYYYYY`). Your job is to create the real accounts, get the real IDs, and swap them in.

> **Note on editing the site:** this playbook does not modify the website. The swaps below are edits a developer makes on the live site files. Where you see "paste into the site," that's a task for whoever maintains `a1prohandyman.com`.

---

## Recommended approach: **Google Tag Manager (GTM)** as the hub

The site was built for this — the `TODO(GREG)` note in the head literally says *"Fire GA4, Google Ads, Meta Pixel, and CallRail number-swap from inside GTM."* GTM lets you manage GA4 + Google Ads conversions in one place without editing site code again after the container is installed.

If you'd rather skip GTM, a **direct gtag.js** path is described at the end (Option B).

---

## Step-by-step (Option A — GTM, recommended)

### 1. Create the accounts (all free)

1. **Google Ads** — [ads.google.com](https://ads.google.com) → create account. When prompted to make a campaign, click **"Switch to Expert Mode"** and, if offered, **"Create an account without a campaign."** Set currency **USD**, time zone **Eastern (US & Canada)**.
2. **Google Analytics 4 (GA4)** — [analytics.google.com](https://analytics.google.com) → create a property for `a1prohandyman.com`. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. **Google Tag Manager** — [tagmanager.com](https://tagmanager.com) → create a **Web container** for `a1prohandyman.com`. Copy the **Container ID** (`GTM-XXXXXXX`).
4. **Google Business Profile** — if not already claimed, claim the Westchester listing. It powers the free **Location asset** and helps local calls. (Not required to launch, but do it.)

### 2. Install the GTM container on the site (one-time dev task)

The site head already has the GTM snippet commented out. The developer replaces `GTM-XXXXXXX` with your real container ID and **uncomments** both parts:
- The `<script>` block in `<head>` (top of every page).
- The `<noscript>` block right after `<body>` opens.

These are standardized across all 22 pages, so it's a find-and-replace + uncomment.

### 3. Create Google Ads conversion actions

In Google Ads → **Goals → Conversions → + New conversion action → Website**. Create these:

| Conversion | Category | Count | Value | Notes |
|---|---|---|---|---|
| **Lead — Form Submit** | Submit lead form | **One** | assign a value (see below) | Primary. Fires on `thank-you.html`. |
| **Lead — Phone Call** | Contact / Phone call lead | **One** | same value | Primary. Fires on `phone_call_click`. |
| **(optional) Form Start** | Submit lead form | Every | no value | Secondary/observe. Fires on `generate_lead`. |

- **Count = "One"** for the two primary actions — one person contacting you = one lead, even if they call twice.
- **Value:** assign a proxy value so Smart Bidding has something to optimize later. A reasonable proxy = *average job value × lead→job close rate*. If you don't know yet, use a placeholder like **$50** for both and refine after ~30 leads.
- **Attribution:** leave at Google's default (data-driven) once you have volume; fine as-is to start.
- After creating each, note its **Conversion ID + Label** (`AW-XXXXXXXXX/AbCdEf... `). You'll need these in GTM and for the `thank-you.html` snippet.
- Also **link Google Ads ↔ GA4** (Ads → Tools → Linked accounts → Google Analytics) so GA4 events and audiences flow into Ads.

### 4. Build the GTM tags (consume the events already firing)

In your GTM container:

**Variables** — enable the built-in **Page Path** variable. Add a **Data Layer Variable** for any event fields you want (e.g. `link_location`, `form_id`).

**Triggers**
- `Trigger — Thank You` = Custom Event, event name **`lead_thank_you`**. *(Or: Page View where Page Path equals `/thank-you.html`.)*
- `Trigger — Phone Click` = Custom Event, event name **`phone_call_click`**.
- `Trigger — Lead Submit` = Custom Event, event name **`generate_lead`** (optional/secondary).

**Tags**
1. **GA4 Configuration** tag — your `G-XXXXXXXXXX`, fires on All Pages.
2. **GA4 Event** tags — send `lead_thank_you`, `phone_call_click`, `generate_lead` as GA4 events (so you can also import them into Ads from GA4 if you prefer).
3. **Google Ads Conversion Tracking** tag → **Lead — Form Submit** (paste its Conversion ID + Label) → fire on **`Trigger — Thank You`**.
4. **Google Ads Conversion Tracking** tag → **Lead — Phone Call** (its Conversion ID + Label) → fire on **`Trigger — Phone Click`**.
5. **Google Ads Conversion Linker** tag — fire on All Pages (lets Ads read the `gclid` cookie so conversions attribute correctly). **Don't skip this.**

### 5. Turn on phone-call tracking (free / Google-native — the chosen approach)

Two layers, both free:

1. **Calls from the ad's call asset:** in Google Ads, when you add the **Call asset** (see `03-ad-copy-and-assets.md`), enable **"Call reporting."** Google swaps in a free forwarding number and counts calls ≥ your chosen duration (set ~30–60s) as a conversion automatically. Add its **"Calls from ads"** conversion action too.
2. **Calls from clicks on the website:** already covered by the `phone_call_click` → Google Ads conversion tag you built in step 4. This captures people who land on the page and tap the number (very common on mobile for same-day work).

> You chose to **skip CallRail** for now. That's the right call at this budget. If call volume grows and you want per-keyword call attribution + recordings, the site already has CallRail placeholders ready to activate later.

### 6. (Optional) Direct conversion snippet on thank-you.html

`thank-you.html` already contains a commented-out block ready for a direct Google Ads tag:

```html
<script>
  gtag('event', 'conversion', {'send_to': 'AW-XXXXXXX/YYYYYYYYYYY'});
</script>
```

**If you fire the conversion via GTM (step 4), leave this commented out** — otherwise the conversion double-counts. Only use this direct snippet if you decide *not* to use GTM (Option B).

---

## Step-by-step (Option B — direct gtag.js, no GTM)

If you skip GTM:
1. In the site `<head>` (all pages), uncomment and set the real IDs: the `gtag/js?id=G-XXXXXXX` loader, `gtag('config','G-XXXXXXX')` (GA4), and `gtag('config','AW-XXXXXXX')` (Ads).
2. On `thank-you.html`, uncomment the `gtag('event','conversion', {'send_to':'AW-XXXXXXX/YYYYYYYYYYY'})` block and paste your real **Lead — Form Submit** ID/label.
3. For phone calls, rely on the Google Ads **call asset** call reporting (step 5.1). (Click-to-call on the site is harder to capture without GTM, so Option A is preferred.)

---

## Verify BEFORE you launch (non-negotiable)

Use **Google Tag Assistant** (tagassistant.google.com) and **GTM Preview mode**:

1. **Load a landing page with a fake ad click:** visit e.g. `https://a1prohandyman.com/same-day-repairs.html?utm_source=google&utm_medium=cpc&utm_campaign=test&gclid=TESTGCLID123`. Confirm the GA4 config tag fires and the Conversion Linker sees the `gclid`.
2. **Submit a test lead** through the 3-step form. Confirm:
   - `generate_lead` fires on submit,
   - you land on `thank-you.html`,
   - `lead_thank_you` fires,
   - the **Lead — Form Submit** conversion tag fires in Tag Assistant.
3. **Tap the phone number** — confirm `phone_call_click` fires and the **Lead — Phone Call** conversion tag fires.
4. **Wait up to 24h**, then check **Google Ads → Goals → Conversions**: the test conversions should appear (they'll show as "unverified" until real traffic — that's fine). GA4 → Realtime should show the events immediately.
5. Confirm the test lead **email actually arrived** from Formspree (the leads inbox). Tracking is worthless if the lead itself doesn't reach a human.

✅ **When a test lead shows up as a conversion in Google Ads and the lead email arrives, tracking is done. Proceed to `02-campaign-playbook.md`.**

---

## Notes & gotchas specific to this site

- **Formspree stays as the lead backend** (`/f/xqerpnav`). It emails leads and redirects to `thank-you.html`. UTMs + `gclid` are already written into hidden form fields, so they ride along in the lead email — your sales follow-up can see which ad/keyword drove each lead.
- **Don't double-count:** pick GTM **or** the direct thank-you snippet for the form conversion, never both.
- **`generate_lead` vs `lead_thank_you`:** `generate_lead` fires on submit but a submit can occasionally fail to reach the thank-you page. `lead_thank_you` only fires on a *successful* redirect — that's why it's the primary form conversion.
- **Consent/GA4 region settings:** default GA4 setup is fine for US traffic; no extra consent config needed to launch.
