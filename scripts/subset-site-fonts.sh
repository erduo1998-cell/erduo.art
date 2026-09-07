#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "usage: scripts/subset-site-fonts.sh /path/to/NotoSansSC-Variable.ttf" >&2
  exit 2
fi

source_font=$1
output_font="assets/fonts/noto-sans-sc-100-900-subset.woff2"
text_file=$(mktemp "${TMPDIR:-/tmp}/erduo-visible-text.XXXXXX")
subset_file=$(mktemp "${TMPDIR:-/tmp}/noto-site.XXXXXX.woff2")
trap 'rm -f "$text_file" "$subset_file"' EXIT

for source in index.html reachsurge/index.html site.js portfolio.js knowledge/index.html knowledge/knowledge.js; do
  test -f "$source"
  sed -n '1,$p' "$source" >> "$text_file"
done

pyftsubset "$source_font" \
  --text-file="$text_file" \
  --output-file="$subset_file" \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting \
  --name-IDs='*' \
  --name-legacy \
  --name-languages='*'

test -s "$subset_file"
mv "$subset_file" "$output_font"
echo "updated $output_font"
shasum -a 256 "$source_font" "$output_font"
