#!/usr/bin/env bash
# Diagnose Vercel CLI network failures — writes NDJSON to debug log.
set -u
LOG="/Users/chao/.cursor/debug-logs/debug-c8b69a.log"
SESSION="c8b69a"
RUN="${1:-pre-fix}"

log() {
  local hypothesis="$1" location="$2" message="$3" data="$4"
  printf '{"sessionId":"%s","runId":"%s","hypothesisId":"%s","location":"%s","message":"%s","data":%s,"timestamp":%s}\n' \
    "$SESSION" "$RUN" "$hypothesis" "$location" "$message" "$data" "$(($(date +%s)*1000))" >> "$LOG"
}

mkdir -p "$(dirname "$LOG")"

# Hypothesis A: stale/invalid VERCEL_TOKEN
token_state="unset"
[[ -n "${VERCEL_TOKEN:-}" ]] && token_state="set"
log "A" "debug-vercel-network.sh:token" "VERCEL_TOKEN state" "{\"state\":\"$token_state\"}"

# Hypothesis B: shell proxy env vars break Node TLS
log "B" "debug-vercel-network.sh:proxy-env" "Proxy environment" \
  "$(node -e "console.log(JSON.stringify({HTTPS_PROXY:process.env.HTTPS_PROXY||null,HTTP_PROXY:process.env.HTTP_PROXY||null,ALL_PROXY:process.env.ALL_PROXY||null,NO_PROXY:process.env.NO_PROXY||null}))")"

# Hypothesis C: npm proxy config differs from shell
npm_proxy="$(npm config get proxy 2>/dev/null || echo null)"
npm_https_proxy="$(npm config get https-proxy 2>/dev/null || echo null)"
log "C" "debug-vercel-network.sh:npm-proxy" "npm proxy config" \
  "{\"proxy\":\"$npm_proxy\",\"httpsProxy\":\"$npm_https_proxy\"}"

# Hypothesis D: curl works but Node fails (proxy/TLS mismatch)
curl_code="$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 10 https://vercel.com/.well-known/openid-configuration 2>/dev/null || echo 000)"
curl_err="$(curl -sS -o /dev/null -w '%{errormsg}' --connect-timeout 10 https://vercel.com/.well-known/openid-configuration 2>&1 | tail -1)"
node_result="$(node -e "
const https=require('https');
https.get('https://vercel.com/.well-known/openid-configuration',r=>process.stdout.write('status='+r.statusCode))
.on('error',e=>process.stdout.write('error='+e.code+':'+e.message));
" 2>&1)"
log "D" "debug-vercel-network.sh:curl-vs-node" "curl vs node with current env" \
  "$(node -e "console.log(JSON.stringify({curlHttp:$curl_code,curlErr:$(node -e "console.log(JSON.stringify(process.argv[1]))" "$curl_err"),nodeResult:$(node -e "console.log(JSON.stringify(process.argv[1]))" "$node_result")}))")"

# Hypothesis E: bypassing proxy fixes Node/Vercel
node_no_proxy="$(env -u HTTPS_PROXY -u HTTP_PROXY -u ALL_PROXY NO_PROXY='*' node -e "
const https=require('https');
https.get('https://vercel.com/.well-known/openid-configuration',r=>process.stdout.write('status='+r.statusCode))
.on('error',e=>process.stdout.write('error='+e.code+':'+e.message));
" 2>&1)"
log "E" "debug-vercel-network.sh:no-proxy-node" "node with proxy unset" \
  "$(node -e "console.log(JSON.stringify({nodeNoProxy:$(node -e "console.log(JSON.stringify(process.argv[1]))" "$node_no_proxy")}))")"

# Hypothesis F: local proxy port availability (10808 / dynamic)
for port in 10808 7890 7897; do
  if nc -z -w1 127.0.0.1 "$port" 2>/dev/null; then
    port_state="listening"
  else
    port_state="closed"
  fi
  log "F" "debug-vercel-network.sh:port-$port" "local proxy port check" "{\"port\":$port,\"state\":\"$port_state\"}"
done

echo "Diagnostics written to $LOG"
echo "curl (current env): http=$curl_code"
echo "node (current env): $node_result"
echo "node (no proxy):    $node_no_proxy"
