# Appeal note — Compromised Site / Circumventing systems

Campaign: `A1 Handyman - Westchester - Urgency` (id 24094873422). Two ads disapproved 2026-08-03 for **Compromised Site** and **Circumventing systems** (Google Investigation). First appeal (filed 2026-08-03/04) was rejected. This is the evidence packet for the second appeal — paste the relevant sections into the Google Ads appeal/support form.

## What to submit

> Our site (a1prohandyman.com) has been independently reviewed for both technical compromise and policy circumvention, and we've made additional changes since the last review. Details below.
>
> **Technical audit (completed 2026-08-04, re-verified 2026-08-05):**
> - Google Search Console Security Issues: clean, no flags.
> - Full server access-log review (3 weeks): zero 403s served to Google crawler user agents; no differential content or redirect behavior based on visitor identity.
> - Site files on the production server (SiteGround, 204 files) audited via SSH: no unexpected modifications, no `eval()`/`base64_decode()`/obfuscated code, single legitimate PHP handler for lead-photo uploads.
> - No cloaking: every page's `rel="canonical"` matches its own served URL exactly; no meta-refresh tags; no JS-based redirects except the standard post-form-submission redirect to our own `/thank-you.html` page (fires only after a successful lead-form POST).
> - Google Tag Manager container (GTM-KFFKDW95) audited: standard GA4/Ads/Meta tags only, no unfamiliar third-party scripts.
> - All Final URLs used in this campaign resolve directly to real, existing pages on our domain with no redirect chain.
>
> **Business-legitimacy fixes shipped 2026-08-05 (live now):**
> - Added a full, visible business address (13 Granada Crescent, White Plains, NY 10603) to every page's footer and to the site's LocalBusiness structured data.
> - Reconciled our two business names: the site displays "Tri-State's Pro Handyman" as our public-facing dba, while "A1 Pro Handyman" is our registered legal name — this relationship is now explicitly disclosed in the footer copyright line and in structured data (`alternateName`) on every page, where previously it was undisclosed.
> - Added a Terms of Service page (a1prohandyman.com/terms.html), linked from the footer of every page alongside our existing Privacy Policy.
>
> We believe the site was already technically clean and that "Circumventing systems" was very likely an automated pairing with the Compromised Site flag rather than an independent finding — but we've closed every legitimacy/transparency gap we could identify in case it factored into a manual review. Happy to provide server logs, GSC screenshots, or SSH audit output directly if useful.

## Still open (not included — no fabricated data)

- HIC/business license numbers are not yet on the site (owner doesn't have them ready). Leaving the `TODO(GREG)` placeholder in place rather than inventing a number — flag this only if Ads support specifically asks about licensing.

## Where to submit

Google Ads UI → the specific disapproved ad → "Appeal" (or Policy Manager → affected ad group → Appeal). This file is reference/evidence only — actually filing the appeal is the user's action in the Ads UI.
