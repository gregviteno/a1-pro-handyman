#!/bin/bash
# Deploys the production build to SiteGround over SSH.
#
# Deliberately deploys the EXACT contents of siteground-production.zip rather
# than re-implementing the staging rules: build-zip.sh already decides which
# assets are referenced and minifies css/js into the staged copy, so this just
# builds the zip, unpacks it, and rsyncs the result. One source of truth.
#
#   ./deploy.sh --dry-run     # show what would change, transfer nothing
#   ./deploy.sh               # push changed files
#   ./deploy.sh --delete      # also remove remote files not in the build
#
# Host/paths come from ~/.ssh/config (Host a1pro) and can be overridden:
#   A1_SSH_HOST=a1pro A1_REMOTE_DIR=/path/to/public_html ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

HOST="${A1_SSH_HOST:-a1pro}"
REMOTE_DIR="${A1_REMOTE_DIR:-/home/customer/www/a1prohandyman.com/public_html}"

EXTRA=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) EXTRA+=("--dry-run") ;;
    # Off by default: public_html holds things the repo doesn't know about
    # (.well-known ACME challenges, SiteGround's own files). Only mirror
    # exactly when you've checked what's up there and want it gone.
    --delete)  EXTRA+=("--delete" "--exclude=.well-known/") ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

echo "==> Building production zip"
./build-zip.sh

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
unzip -q siteground-production.zip -d "$STAGE"

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
