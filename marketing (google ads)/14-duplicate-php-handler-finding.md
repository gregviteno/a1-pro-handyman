# Finding — duplicate PHP upload handler was live on the server (fixed 2026-08-11)

**This is the first concrete, verifiable thing found that a "Compromised Site" classifier could plausibly fire on.** Add it to the next appeal. It is a real remediation, not a restatement of the technical-audit evidence in note `12`.

## What was wrong

`photo-handler.php` was still live in `public_html`, **byte-identical** to `send-photo.php` (same md5: `651f37d5159099f95fefb622b332167a`). Both were executing — `GET` returned 405, `POST` returned 400. Neither was 404.

The site was therefore serving **two identical PHP endpoints**, under different names, each containing all of:

- `$_FILES` (accepts an uploaded file)
- `move_uploaded_file`
- `base64_encode`
- `mail()`

## Why this matters more than either file alone

Per `CLAUDE.md`, `photo-handler.php` was deliberately renamed to `send-photo.php` precisely "to reduce false-positive matches against automated malware-scanner signatures for upload+base64+mail() patterns."

**That rename never took effect in production.** The new filename was deployed; the old file was never removed. So the defensive rename did the opposite of its intent — instead of one copy of the flagged pattern, the server carried two.

A duplicated mail-sending upload handler living under two filenames is itself a recognised webshell/mailer-backdoor signature: attackers routinely drop redundant copies under alternate names so removing one doesn't cut off access. An automated scanner does not know the second copy is a stale deploy artifact. It sees redundant upload+mail endpoints, which is a stronger malware signal than a single handler would be.

## Root cause

`deploy.sh` intentionally does **not** pass `--delete` (the comment explains why: `public_html` holds things the repo doesn't know about, like `.well-known` ACME challenges). Combined with the migration from zip-upload deploys to rsync deploys, that meant **every file from the zip era was stranded on the server indefinitely** — 61 files in total, including the duplicate handler.

Note the owner's original hypothesis was that changing deploy method from zip-upload to SSH/rsync caused the policy problem. Google cannot observe deploy method — rsync and unzip produce identical bytes. But the instinct was directionally correct: it was the *switch*, via `--delete` never being used, that stranded the file.

## Fix applied 2026-08-11

- Ran `./deploy.sh --delete`, removing all 61 stranded files including `photo-handler.php`.
- Verified `photo-handler.php` now returns **404** on both GET and POST.
- Verified `send-photo.php` (405) and `contact-handler.php` (302) still respond correctly — the live lead-photo path is intact.
- Swept all **106** referenced assets across all 23 pages: **zero** 404s.
- Server file list now matches the production build exactly. The only remaining extras are `.well-known/acme-challenge/*` (SSL renewal) and SiteGround's `autoconfig/mail/config-v1.1.xml` — both legitimate and correctly excluded from `--delete`.
- Only two PHP files remain on the server: `send-photo.php` (live) and `contact-handler.php` (documented Formspree fallback).

## Also hardened

The site's only outbound link (`homebuilderwiz.com`, designer attribution, in the footer of all 23 pages) now carries `rel="noopener nofollow sponsored"`. That domain sits behind a Cloudflare challenge that returns 403 to non-browser clients, which could include Google's review crawler. An outbound link to a challenged domain is not itself a violation, and this is unlikely to have been a factor — but it was the last unexamined external reference on the site, and marking it costs nothing.

## Wording for the appeal

> During a further audit we found and removed a stale deployment artifact: an older copy of our lead-photo upload handler (`photo-handler.php`) that remained on the server after the file was renamed, byte-identical to the current handler. The site was therefore briefly serving two identical PHP endpoints that each accepted a file upload and sent mail — a pattern we understand can resemble a malware signature to automated scanning, despite both files being our own legitimate lead-capture code. We have removed the duplicate and reconciled the server against our build: the server file list now matches our deployment artifact exactly, with only two PHP files present (the live photo handler and a documented fallback form handler). All 106 referenced assets across the site were verified to resolve.

## Honest caveats

- **This is not confirmed as the trigger.** Google has never named a specific cause. This is the most plausible concrete finding to date, and it is worth fixing regardless of whether it moves the appeal.
- The disapprovals were dated 2026-08-03; the stale `photo-handler.php` carried an mtime of 2026-08-03 21:14. That correlation is suggestive but not proof — the mtime reflects a deploy, not necessarily first appearance.
- Still open: the HIC license number is on every page as the literal placeholder `HIC #[LICENSE-NUMBER]`.
- Still open: off-site name consistency (GBP especially) after the Tri-State retirement — see note `13`.

## Process fix worth considering

`deploy.sh` without `--delete` will strand files again on any future rename or deletion. Options: make `--delete` the default (it already excludes `.well-known/`), or add a periodic reconciliation check. A rename in this repo does not currently reach production as a rename — it reaches production as an addition.
