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
zip -rq -9 sg.zip .
cd - >/dev/null
mv "$STAGE/sg.zip" siteground-production.zip
ls -la siteground-production.zip
