#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Lost Plate CS Copilot — Vercel deploy"
echo ""

# Vercel CLI uses Node fetch; local proxy env vars (Clash/Cursor/VPN) often
# break TLS to vercel.com with "socket disconnected before secure TLS".
vercel_env() {
  env -u HTTPS_PROXY -u HTTP_PROXY -u ALL_PROXY \
    NO_PROXY='*' \
    "$@"
}

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  if ! vercel_env npx vercel whoami &>/dev/null; then
    echo "Not logged in."
    echo ""
    echo "Option A — browser login (proxy bypassed):"
    echo "  vercel_env npx vercel login"
    echo ""
    echo "Option B — token (no browser):"
    echo "  1. Open https://vercel.com/account/tokens"
    echo "  2. Create token, then:"
    echo "     export VERCEL_TOKEN=your_token_here"
    echo "     ./scripts/deploy-vercel.sh"
    echo ""
    vercel_env npx vercel login
  fi
else
  echo "Using VERCEL_TOKEN from environment."
fi

echo ""
echo "→ Deploying to production…"
vercel_env npx vercel --prod --yes

echo ""
echo "Done. Copy the URL above into FOLLOW_UP_EMAIL.md"
