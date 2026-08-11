#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${JCORE_ENV_FILE:-/home/jcore/.config/j-core/j-core.env}"
if [[ ! -r "$ENV_FILE" ]]; then
  echo "J-Core environment is not readable: $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT

LOGIN_PAYLOAD="$(printf '{"username":"%s","password":"%s"}' "$JCORE_AUTH_USERNAME" "$JCORE_AUTH_PASSWORD")"
LOGIN_STATUS="$(curl -sS -o /dev/null -w '%{http_code}' -c "$COOKIE_JAR" \
  -H 'content-type: application/json' -d "$LOGIN_PAYLOAD" http://127.0.0.1:8787/api/auth/login)"
[[ "$LOGIN_STATUS" == "200" ]] || { echo "J-Core login failed: HTTP $LOGIN_STATUS" >&2; exit 1; }

for entry in \
  "Hermes|http://127.0.0.1:9120/" \
  "OpenClaw|http://127.0.0.1:18790/" \
  "9Router|http://127.0.0.1:20129/dashboard"; do
  label="${entry%%|*}"
  url="${entry#*|}"
  result="$(curl -sS -L -o /dev/null -w '%{http_code}|%{url_effective}' -b "$COOKIE_JAR" "$url")"
  status="${result%%|*}"
  [[ "$status" == "200" ]] || { echo "$label native dashboard failed: $result" >&2; exit 1; }
  echo "$label native dashboard: $result"
done

for port in 9120 18790 20129; do
  status="$(curl -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:${port}/")"
  [[ "$status" == "401" ]] || { echo "Proxy $port accepted an unauthenticated request: HTTP $status" >&2; exit 1; }
done

echo "Native dashboard authentication boundary: passed"
