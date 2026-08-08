#!/bin/bash
# Builds siteground-production.zip from a clean staging dir:
#  - ships only assets actually referenced by HTML/CSS/JS (%20-decoded match)
#  - minifies css/custom.css, js/main.js, js/tracking.js (repo sources stay readable)
#  - excludes .DS_Store, node_modules, dev files, and this script
set -euo pipefail
cd "$(dirname "$0")"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

STAGE="$STAGE" node -e "
const fs = require('fs'), path = require('path');
const STAGE = process.env.STAGE;
const texts = [...fs.readdirSync('.').filter(f=>f.endsWith('.html')), 'css/styles.css','css/custom.css','js/main.js','js/tracking.js'];
const blob = texts.map(f=>fs.readFileSync(f,'utf8')).join('\n').replace(/%20/g,' ');
const walk = d => fs.readdirSync(d, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(d,e.name)) : [path.join(d,e.name)]);
const assets = walk('assets').filter(f => !f.endsWith('.DS_Store'));
const referenced = assets.filter(a => blob.includes(path.basename(a)));
const roots = [...fs.readdirSync('.').filter(f=>f.endsWith('.html')), 'css/styles.css','css/custom.css','js/main.js','js/tracking.js','contact-handler.php','photo-handler.php','.htaccess','robots.txt','sitemap.xml'];
for (const f of [...roots, ...referenced]) {
  const dest = path.join(STAGE, f);
  fs.mkdirSync(path.dirname(dest), {recursive:true});
  fs.copyFileSync(f, dest);
}
console.log('staged ' + (roots.length + referenced.length) + ' files; excluded ' + (assets.length - referenced.length) + ' unreferenced assets');
"

cd "$STAGE"
npx -y esbuild --minify css/custom.css --outfile=css/custom.css --allow-overwrite --log-level=error
npx -y esbuild --minify js/main.js --outfile=js/main.js --allow-overwrite --log-level=error
npx -y esbuild --minify js/tracking.js --outfile=js/tracking.js --allow-overwrite --log-level=error
node --check js/main.js && node --check js/tracking.js

# ---- Cache-bust the stylesheet/script URLs -------------------------------
# The host serves HTML with a 180-day Cache-Control we cannot override from
# .htaccess (its Header directives are ignored - our "immutable" flag never
# reaches the response). A returning visitor can therefore hold old HTML while
# css/styles.css - a fixed filename - is fetched fresh, which renders old
# markup against a new stylesheet: purged utility classes collapse and whole
# sections lose their backgrounds.
#
# Stamping a content hash onto the asset URLs makes each deploy reference new
# URLs. Cached HTML keeps pointing at the assets it was built against, so a
# stale page still renders coherently instead of half-styled, and any fresh
# page gets the new build immediately. Applied to the staged copy only - repo
# sources stay clean, same as the minify step above.
BUILD_ID="$(cat css/styles.css css/custom.css js/main.js js/tracking.js | shasum | cut -c1-10)"
node -e "
const fs = require('fs'), path = require('path');
const id = process.argv[1];
let n = 0;
for (const f of fs.readdirSync('.').filter(f => f.endsWith('.html'))) {
  const before = fs.readFileSync(f, 'utf8');
  const after = before.replace(
    /(href|src)=\"(\/(?:css|js)\/[a-zA-Z0-9._-]+\.(?:css|js))\"/g,
    (_, attr, url) => attr + '=\"' + url + '?v=' + id + '\"');
  if (after !== before) { fs.writeFileSync(f, after); n++; }
}
console.log('stamped build ' + id + ' onto ' + n + ' pages');
" "$BUILD_ID"

zip -rq -9 sg.zip .
cd - >/dev/null
mv "$STAGE/sg.zip" siteground-production.zip
ls -la siteground-production.zip
