#!/bin/bash
# Bundles all project source into one markdown file for Gemini upload/paste.
# Usage: ./scripts/export-for-gemini.sh > GEMINI_FULL_CONTEXT.md
#    or: ./scripts/export-for-gemini.sh   (writes GEMINI_FULL_CONTEXT.md in project root)

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/GEMINI_FULL_CONTEXT.md"

{
  echo "# Lost Plate Guest Ops Copilot — Full Source Bundle"
  echo ""
  echo "Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo ""
  echo "Read \`GEMINI.md\` first for architecture and constraints."
  echo ""
  echo "---"
  echo ""

  for f in GEMINI.md README.md FOLLOW_UP_EMAIL.md PLAN-B.md index.html css/styles.css \
    js/app.js js/utils.js js/data.js js/openrouter.js js/email-reply.js js/i18n.js \
    js/reminders.js js/reminder-data.js js/weather.js js/guide-comms.js \
    js/guide-data.js js/ops-board.js; do
    path="${ROOT}/${f}"
    if [[ -f "$path" ]]; then
      ext="${f##*.}"
      lang="text"
      [[ "$ext" == "js" ]] && lang="javascript"
      [[ "$ext" == "css" ]] && lang="css"
      [[ "$ext" == "html" ]] && lang="html"
      echo "## File: \`${f}\`"
      echo ""
      echo "\`\`\`${lang}"
      cat "$path"
      echo ""
      echo "\`\`\`"
      echo ""
      echo "---"
      echo ""
    fi
  done
} > "$OUT"

echo "Wrote ${OUT} ($(wc -c < "$OUT" | tr -d ' ') bytes)" >&2
