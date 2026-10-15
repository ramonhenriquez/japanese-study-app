
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Building Japanese Study App..."
node "$ROOT/tools/build.js"

echo "Copying application into Astro..."
mkdir -p "$ROOT/website/public/study"
cp "$ROOT/dist/index.html" "$ROOT/website/public/study/index.html"

echo "Building Astro website..."
cd "$ROOT/website"
npm run build

echo "Website build complete."
