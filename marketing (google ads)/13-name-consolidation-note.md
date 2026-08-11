# Name consolidation — Tri-State dba retired (2026-08-11)

**This note supersedes the "Reconciled our two business names" bullet in `12-circumventing-systems-appeal-note.md`. Read this before filing any further appeal — note 12's evidence packet now describes the site inaccurately.**

## What changed

Every reference to "Tri-State's Pro Handyman" was removed from the site. Zero occurrences remain in any of the 23 pages. Deployed live 2026-08-11.

| Location | Before | After |
|---|---|---|
| Header wordmark | `TRI-STATE'S / PRO / HANDYMAN` | `A1 PRO / HANDYMAN` |
| LocalBusiness schema (22 pages) | `"alternateName": "Tri-State's Pro Handyman"` | field removed entirely |
| Footer copyright (23 pages) | `© 2026 A1 Pro Handyman, dba Tri-State's Pro Handyman.` | `© 2026 A1 Pro Handyman.` |
| `terms.html` body + 3 meta tags | `A1 Pro Handyman, dba Tri-State's Pro Handyman` | `A1 Pro Handyman` |
| `contact.html` meta descriptions | "across the tri-state area" | "across the New York metro area" |

The site now presents exactly one business name — **A1 Pro Handyman** — matching the registered legal name, the domain, and the Google Ads account.

## Why this reverses note 12

Note 12's appeal packet listed the dba disclosure as a *business-legitimacy fix*, on the reasoning that an undisclosed second name looked evasive, so disclosing the relationship closed a transparency gap.

The owner's read is the opposite and, on balance, the stronger one: the safest position under Google's misrepresentation policy is not a well-disclosed second name but **no second name at all**. A single consistent identity across site, domain, GBP, and Ads account is the thing reviewers actually pattern-match on. A dba disclosure still requires a reviewer to accept the explanation; consistency requires nothing.

## If you file another appeal

Do **not** paste note 12's packet as written — the "Reconciled our two business names" bullet describes a site state that no longer exists, and submitting a stale description to a reviewer who then loads the live site is exactly the kind of mismatch that sinks an appeal.

Replace that bullet with:

> Consolidated to a single business name. The site previously displayed "Tri-State's Pro Handyman" as a public-facing dba alongside our registered legal name. We have removed that name entirely — from the header, the footer, our Terms of Service, page metadata, and our LocalBusiness structured data. The site, the domain, and this Ads account now all present the same single name: A1 Pro Handyman.

Every other bullet in note 12 (technical audit, address, ToS page) is still accurate.

## Caveats worth knowing

- **Timing.** If an appeal is currently open and under review, the site changed underneath it. That's not inherently bad — the change strengthens the position — but a reviewer comparing the site to a submitted description will see a discrepancy. Consider withdrawing and refiling with the corrected text rather than letting a reviewer find the mismatch.
- **Off-site consistency is now the weak link.** The site is clean, but if the Google Business Profile, any directory listing, invoices, or the SiteGround/WHOIS records still carry "Tri-State," the inconsistency simply moved off-site where it's harder to control. Worth an audit of GBP specifically, since Ads cross-references it.
- **Root cause remains unproven.** There is no confirmation from Google that the dba was ever the trigger. The original disapprovals were *Compromised Site* + *Circumventing systems*, and note 12's own assessment was that the latter was likely an automated pairing with the former. This change removes a plausible contributing factor; it is not a demonstrated fix.
- **Still open:** the HIC license number is on the site as the literal placeholder `HIC #[LICENSE-NUMBER]`, visible to customers in the footer of every page. That is a more visible legitimacy problem right now than the name ever was.
