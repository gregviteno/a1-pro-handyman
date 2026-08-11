#!/bin/bash
# Deploys the production build to SiteGround over SSH.
#
# Deliberately deploys the EXACT contents of siteground-production.zip rather
# than re-implementing the staging rules: build-zip.sh already decides which
# assets are referenced and minifies css/js into the staged copy, so this just
# builds the zip, unpacks it, and rsyncs the result. One source of truth.
#
#   ./deploy.sh --dry-run     # show what would change, transfer nothing
#   ./deploy.sh               # push changed files AND remove stale ones
#   ./deploy.sh --no-delete   # push only; leave remote-only files in place
#
# Host/paths come from ~/.ssh/config (Host a1pro) and can be overridden:
#   A1_SSH_HOST=a1pro A1_REMOTE_DIR=/path/to/public_html ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

HOST="${A1_SSH_HOST:-a1pro}"
REMOTE_DIR="${A1_REMOTE_DIR:-/home/customer/www/a1prohandyman.com/public_html}"

# --delete is ON by default. It used to be opt-in, on the reasoning that
# public_html holds things the repo doesn't know about — but the real effect
# was that a rename in the repo reached production as an *addition*: the new
# name was uploaded and the old file was left running forever.
#
# That is not theoretical. photo-handler.php was renamed to send-photo.php
# specifically to stop tripping malware-scanner signatures (upload + base64 +
# mail), and because deploys never deleted, the server carried BOTH files,
# byte-identical, for over a week — while the Google Ads account was under
# review for "Compromised Site". A duplicated mailer under two filenames is
# itself a webshell signature. Mirroring exactly is the safer default.
#
# The exclusions below are the things that legitimately live only on the
# server. Anything else remote-only is a stale deploy artifact by definition.
DELETE=1
EXTRA=()
for arg in "$@"; do
  case "$arg" in
    --dry-run)   EXTRA+=("--dry-run") ;;
    --no-delete) DELETE=0 ;;
    # Accepted so old muscle memory / scripts don't break; already the default.
    --delete)    DELETE=1 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

if [ "$DELETE" -eq 1 ]; then
  EXTRA+=(
    "--delete"
    "--exclude=.well-known/"        # ACME/SSL renewal challenges
    "--exclude=autoconfig/"         # SiteGround mail client autoconfig
    "--exclude=cgi-bin/"            # created by the host, not by us
    "--exclude=.htpasswd"           # host/panel-managed auth files
  )
fi

echo "==> Building production zip"
./build-zip.sh

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
unzip -q siteground-production.zip -d "$STAGE"

if [ "$DELETE" -eq 1 ]; then
  echo "==> Mirroring exactly (stale remote files will be removed)"
else
  echo "==> Push-only (--no-delete): remote-only files will be LEFT IN PLACE"
fi

echo "==> Deploying to $HOST:$REMOTE_DIR"
# --checksum, not timestamps: the staged files are freshly created every build,
# so mtimes always differ and would re-upload the whole site each time.
# ${EXTRA[@]+...} guard: bash 3.2 (macOS) treats an empty array as unbound
# under `set -u`, so a plain "${EXTRA[@]}" aborts a no-flag deploy.
rsync -rlvz --checksum --human-readable \
  ${EXTRA[@]+"${EXTRA[@]}"} \
  --exclude='.DS_Store' \
  "$STAGE"/ "$HOST:$REMOTE_DIR"/

echo "==> Done"
