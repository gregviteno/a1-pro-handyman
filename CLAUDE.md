# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing site for A1 Pro Handyman (dba "Tri-State Pro Handyman" in the header wordmark), a handyman service business serving Westchester/Rockland/Nassau/Putnam Counties NY, Fairfield County CT, and Manhattan. No backend framework, no build-time templating — every page is a standalone, fully self-contained HTML file. Primary traffic is mobile users clicking through from Google Ads / Meta Ads, so **mobile load speed is the top priority** for any change.

## Stack

- Static HTML5 (22 pages at repo root: homepage, 6 service pages, 6 regional/county pages, about/contact/services/privacy/404/thank-you, plus `design-system.html` — an internal noindexed style guide)
- Tailwind CSS, compiled (not JIT/runtime) — `css/input.css` → `css/styles.css`
- `css/custom.css` — hand-written CSS for things Tailwind utilities don't cover (custom animations, `@font-face`, sticky-header hysteresis states)
- Vanilla JS, no framework: `js/main.js` (UI behavior — sticky header, mobile nav, dropdowns, FAQ accordions) and `js/tracking.js` (ad-attribution capture + dataLayer/GTM events)
- `contact-handler.php` — legacy form handler, intentionally kept as a documented fallback even though forms currently POST to Formspree (see Known TODOs)
- `photo-handler.php` — live, in use. Receives the optional photo upload and emails it as an attachment, because Formspree's free plan rejects any submission carrying a file (see Known history)
- Fonts are self-hosted (`assets/fonts/*.woff2`, Barlow + Barlow Condensed) — no Google Fonts `<link>`
- Deploys to SiteGround shared hosting by unzipping a production zip into `public_html`

## Commands

```bash
# Rebuild Tailwind after ANY class-name change in HTML (see Critical gotcha below)
npx tailwindcss -i css/input.css -o css/styles.css --minify

# Build the production deploy zip (siteground-production.zip)
./build-zip.sh
```

`build-zip.sh` stages only assets actually referenced by the HTML/CSS/JS (percent-decoded match against a blob of all source text), minifies `css/custom.css` + `js/main.js` + `js/tracking.js` via `npx esbuild` into the staged copy only (repo sources stay unminified/readable), and zips the result. Always use this script for packaging a deploy — do not hand-roll a flat zip, since that re-includes unreferenced legacy assets.

There is no test suite (`npm test` is a stub) and no linter configured.

## Critical gotcha: Tailwind is a build step, not live

`css/styles.css` is a compiled, purged artifact generated from `tailwind.config.js`'s `content: ["./*.html", "./js/*.js"]` scan — it is **not** a runtime framework. Adding or changing any utility class in HTML (especially arbitrary-value classes like `h-[260px]`) has **zero visual effect** until `npx tailwindcss -i css/input.css -o css/styles.css --minify` is re-run. There is no error or warning — the element just silently falls back to unstyled. If a class-name edit "doesn't seem to do anything" when previewed, this is almost always the cause — rebuild before suspecting anything else.

## Page structure conventions

Every page repeats the same head/header/footer boilerplate rather than sharing a template (no include system):
- `<head>` carries per-page `<title>`/meta description/canonical/OG/Twitter tags, font preloads, GTM snippet (`GTM-KFFKDW95`), and one or more `application/ld+json` schema blocks (`HomeAndConstructionBusiness` + page-relevant `FAQPage`, etc.)
- Sticky header with logo, "TRI-STATE PRO HANDYMAN" wordmark, nav with hover/click dropdowns (`.has-dropdown`), mobile hamburger menu (`#nav-toggle` / `#mobile-menu`)
- Lead forms carry `data-lead-form`, hidden UTM/gclid/`landing_page`/`referrer`/`source_page`/`form_ts` inputs populated by `js/tracking.js`, and a honeypot field; they POST to Formspree
- Hero/content images use `<picture><source type="image/webp">…<img .jpg/.png></picture>` pairs, not bare `<img>` — this was a deliberate performance fix (see Known history)

When adding a new page, copy the closest existing sibling (e.g. an existing regional page for a new county) rather than building the head/header/footer from scratch, to keep schema and tracking wiring consistent.

## Known history / traps to avoid

- **Fake-SVG images**: some legacy assets on disk are raster photos (JPEG/PNG) base64-embedded inside an `.svg` wrapper from an AI image-export tool — multi-MB files that look lightweight because of the extension. Before trusting any `.svg` asset as a real vector, check `grep -c "base64," file.svg`. If it wraps raster data, extract via `sharp(file.svg, {density: <high>}).png()` (rasterize the whole SVG, not just the largest embedded blob — some files composite multiple images and a "grab the biggest blob" heuristic silently drops the others) and re-export as sized JPG+WebP pairs matching the page's actual display dimensions.
- **Filenames with spaces**: several asset paths contain literal spaces (e.g. `assets/process images/...`). Browsers percent-encode these in `src`/`href` (`%20`), so a literal-string grep for the on-disk filename will miss real references. Any "is this file still used" audit script must decode `%20` before comparing, and results should be cross-checked against a locally-served HTTP 200 check before deleting anything.
- **`git restore --staged --worktree`** on a pathspec will delete files that were staged via an earlier `git add -A` but have no HEAD counterpart (i.e., new files), even though they looked "untracked" moments before. Avoid broad `git add -A` mid-task if you might still need to restore/undo within that same directory.
- `assets/img/og-image.svg` is a placeholder — SVG isn't rendered by most social platforms for link previews, and the user is deliberately leaving it until real creative is supplied. Don't silently replace it with invented content.
- GTM container is live (`GTM-KFFKDW95`) with all 4 conversion actions (form submit, phone call from ads, phone call from website, generic lead) verified firing as of 2026-07-20. Some `LocalBusiness` schema fields (`address`, `openingHoursSpecification`, `sameAs`, HIC license numbers) are still marked `TODO(GREG)` in page heads — deliberately deferred, not fillable without the user's real values.
- `contact-handler.php` is orphaned (forms now POST to Formspree) but intentionally kept in the deploy as a fallback in case Formspree's free-tier submission cap is hit during an ad campaign.
- **Never let a file into the Formspree POST.** File uploads are a paid Formspree feature; on the free plan any submission carrying a file is rejected, and since `js/main.js` POSTs the form in one shot that was failing the *entire* lead — the customer saw the generic "Something went wrong" error and the name/phone/job details were lost along with the photo. `js/main.js` now `delete()`s the file field from the Formspree FormData and POSTs the file separately to `photo-handler.php`, which mails it as an attachment referencing the lead by name/phone. The photo send deliberately never rejects, so a failed upload can't block the lead or the thank-you redirect. If a photo/file field is ever added to a new form, it must follow this same split.
- `photo-handler.php` reads the upload straight from PHP's temp dir and never writes it into the web root, so there's no uploads directory to harden. Its `$LEADS_EMAIL` is still the `TODO(GREG)` placeholder and must match the inbox Formspree delivers to, or leads and their photos land in different mailboxes.
- Google Ads campaign docs (no site code) live in `marketing (google ads)/`. The original `README.md`/`01`–`06` document a Westchester-only launch plan and are kept as-is — **new/changed campaign plans go in new numbered files instead of editing those in place**. `07` (3-county launch) was in turn superseded by `08-westchester-launch-plan.md`; both are kept.

## Google Ads — current status & next steps

- Tracking: **done**, live, verified (see above).
- Superseded, kept for reference only: `01`–`06` (original Westchester-only plan) and `07` (3-county Westchester/Rockland/Bronx plan at $12/day — invalidated when the owner's real budget came in at $10/day max; now the reference for future geo expansion).
- **Active plan: `marketing (google ads)/08-westchester-launch-plan.md`** — one Search campaign, **Westchester County only**, $10/day, Manual CPC, two ad groups (`Same-Day / Emergency` + `High-Value Repairs`). Ad schedule Mon–Fri 8am–7pm, Sat/Sun 8am–4pm ET. **Not yet built in the Google Ads account.**
  - Import files ready: `09-westchester-import-keywords.csv` (18 keywords, both ad groups, per-keyword Final URLs), `10-westchester-geo-negatives.csv` (13 adjacent-geo negatives), plus `05-negative-keywords.csv` unchanged (campaign name column already matches).
  - Budget reality: ~37 clicks/month → 3–6 leads/month. Concentration beats coverage; resist adding geos, keywords, or campaigns until a CPL is established.
- Open items before launch (full checklist in `08`):
  - [ ] Build the campaign — use **"Create a campaign without a goal's guidance" → Search**; the guided wizard forces Smart/PMax and hides Manual CPC, ad schedule, and the Presence location option
  - [ ] Import `09`, `10`, and `05` via Google Ads Editor
  - [ ] Build 2 RSAs per ad group from `03`'s copy (single-county, so no Location Insertion customizer needed)
  - [ ] Attach call asset (914) 693-0009 with call reporting on + `03`'s sitelinks/callouts/snippets; link the GBP location asset
  - [ ] Verify location targeting saved as **"Presence"** (UI silently defaults to "Presence or interest") and the schedule saved in Eastern
  - [ ] Run `08`'s verification checklist with the campaign paused, then unpause
  - [ ] Week 3: add `handyman near me` Phrase **only if underspending** — it's held back deliberately as a budget hog
  - [ ] Deferred: `bronx-handyman.html` doesn't exist and isn't needed until Bronx is actually targeted (see `07`)
