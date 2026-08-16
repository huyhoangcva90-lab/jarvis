#!/usr/bin/env bash

# Read-only diagnostics for the JARVIS server and its local AI upstreams.
# Secrets are used only for login/upstream checks and are never printed.

set -u

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${JCORE_ENV_FILE:-$ROOT_DIR/.env.local}"
PUBLIC_GATEWAY="${JCORE_PUBLIC_ORIGIN:-}"
SERVICE_NAME="${JCORE_SERVICE_NAME:-gateway-api.service}"
PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

if [[ -t 1 ]]; then
  GREEN=$'\033[32m'
  YELLOW=$'\033[33m'
  RED=$'\033[31m'
  CYAN=$'\033[36m'
  RESET=$'\033[0m'
else
  GREEN=""
  YELLOW=""
  RED=""
  CYAN=""
  RESET=""
fi

pass() {
  PASS_COUNT=$((PASS_COUNT + 1))
  printf '%s[PASS]%s %s\n' "$GREEN" "$RESET" "$1"
}

warn() {
  WARN_COUNT=$((WARN_COUNT + 1))
  printf '%s[WARN]%s %s\n' "$YELLOW" "$RESET" "$1"
}

fail() {
  FAIL_COUNT=$((FAIL_COUNT + 1))
  printf '%s[FAIL]%s %s\n' "$RED" "$RESET" "$1"
}

section() {
  printf '\n%s== %s ==%s\n' "$CYAN" "$1" "$RESET"
}

read_env() {
  local key="$1"
  local value=""
  if [[ -f "$ENV_FILE" ]]; then
    value="$(
      awk -v prefix="${key}=" '
        index($0, prefix) == 1 {
          value = substr($0, length(prefix) + 1)
        }
        END { print value }
      ' "$ENV_FILE" | tr -d '\r'
    )"
  fi
  if [[ "$value" == \"*\" && "$value" == *\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" == \'*\' && "$value" == *\' ]]; then
    value="${value:1:${#value}-2}"
  fi
  printf '%s' "$value"
}

check_secret() {
  local label="$1"
  local value="$2"
  if [[ -n "$value" ]]; then
    pass "$label is configured (${#value} characters; value hidden)"
  else
    warn "$label is missing"
  fi
}

check_expected_url() {
  local key="$1"
  local expected="$2"
  local actual
  actual="$(read_env "$key")"
  if [[ "$actual" == "$expected" ]]; then
    pass "$key=$expected"
  elif [[ -z "$actual" ]]; then
    warn "$key is empty (backend will not be used)"
  else
    warn "$key uses '$actual'; expected '$expected'"
  fi
}

login_cookie() {
  local base_url="$1"
  local username="$2"
  local password="$3"
  local cookie_file="$4"
  local output_file
  local payload
  local status

  output_file="$(mktemp)"
  payload="$(printf '{"username":"%s","password":"%s"}' "$username" "$password")"
  status="$(
    curl --silent --show-error --max-time 8 \
      --cookie-jar "$cookie_file" \
      --output "$output_file" \
      --write-out "%{http_code}" \
      -H "content-type: application/json" \
      --data "$payload" \
      "$base_url/api/auth/login" 2>/dev/null || true
  )"
  rm -f -- "$output_file"
  [[ "$status" == 2?? ]]
}

http_check() {
  local label="$1"
  local url="$2"
  local token="${3:-}"
  local cookie_file="${4:-}"
  local output_file
  local status
  local curl_args=(
    --silent
    --show-error
    --location
    --max-time 8
    --output
  )

  output_file="$(mktemp)"
  curl_args+=("$output_file" --write-out "%{http_code}")
  if [[ -n "$token" ]]; then
    curl_args+=(-H "Authorization: Bearer $token")
  fi
  if [[ -n "$cookie_file" ]]; then
    curl_args+=(--cookie "$cookie_file")
  fi

  status="$(curl "${curl_args[@]}" "$url" 2>/dev/null || true)"
  case "$status" in
    2??)
      pass "$label reachable (HTTP $status)"
      ;;
    401|403)
      fail "$label reachable but token was rejected (HTTP $status)"
      ;;
    000|"")
      fail "$label unreachable"
      ;;
    *)
      warn "$label returned HTTP $status"
      ;;
  esac
  rm -f -- "$output_file"
}

section "Repository"
printf 'Project: %s\n' "$ROOT_DIR"
if [[ -d "$ROOT_DIR/.git" ]]; then
  branch="$(git -C "$ROOT_DIR" branch --show-current 2>/dev/null || true)"
  commit="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || true)"
  pass "Git repository detected (branch=${branch:-unknown}, commit=${commit:-unknown})"
else
  fail "No .git directory found at $ROOT_DIR"
fi

if [[ -f "$ENV_FILE" ]]; then
  pass "Configuration found at $ENV_FILE"
else
  fail "Missing $ENV_FILE"
fi

section "Gateway service"
if systemctl --user is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
  pass "$SERVICE_NAME is active"
else
  fail "$SERVICE_NAME is not active"
fi
if systemctl --user is-enabled --quiet "$SERVICE_NAME" 2>/dev/null; then
  pass "$SERVICE_NAME is enabled"
else
  warn "$SERVICE_NAME is not enabled"
fi

if command -v ss >/dev/null 2>&1; then
  for port in 8787 8642 18789 20128; do
    if ss -lnt 2>/dev/null | awk '{print $4}' | grep -Eq "(^|:)$port$"; then
      pass "TCP port $port is listening"
    else
      warn "TCP port $port is not listening"
    fi
  done
else
  warn "ss is unavailable; skipped listening-port checks"
fi

section "Configuration"
JCORE_AUTH_USERNAME="$(read_env JCORE_AUTH_USERNAME)"
JCORE_AUTH_PASSWORD="$(read_env JCORE_AUTH_PASSWORD)"
HERMES_TOKEN="$(read_env HERMES_API_KEY)"
OPENCLAW_TOKEN="$(read_env OPENCLAW_API_KEY)"
NINEROUTER_TOKEN="$(read_env NINEROUTER_API_KEY)"
NINEROUTER_MODEL="$(read_env NINEROUTER_MODEL)"

check_secret "JCORE_AUTH_PASSWORD" "$JCORE_AUTH_PASSWORD"
check_secret "HERMES_API_KEY" "$HERMES_TOKEN"
check_secret "OPENCLAW_API_KEY" "$OPENCLAW_TOKEN"
check_secret "NINEROUTER_API_KEY" "$NINEROUTER_TOKEN"
if [[ -n "$NINEROUTER_MODEL" ]]; then
  pass "NINEROUTER_MODEL=$NINEROUTER_MODEL"
else
  warn "NINEROUTER_MODEL is missing"
fi

check_expected_url HERMES_CHAT_URL "http://127.0.0.1:8642/v1/chat/completions"
check_expected_url OPENCLAW_CHAT_URL "http://127.0.0.1:18789/v1/chat/completions"
check_expected_url NINEROUTER_CHAT_URL "http://127.0.0.1:20128/v1/chat/completions"

section "Local APIs"
JCORE_COOKIE_FILE="$(mktemp)"
trap 'rm -f -- "$JCORE_COOKIE_FILE"' EXIT
if [[ -n "$JCORE_AUTH_PASSWORD" ]] && login_cookie "http://127.0.0.1:8787" "${JCORE_AUTH_USERNAME:-admin}" "$JCORE_AUTH_PASSWORD" "$JCORE_COOKIE_FILE"; then
  pass "JARVIS local session login works"
  http_check "JARVIS local health" "http://127.0.0.1:8787/health" "" "$JCORE_COOKIE_FILE"
else
  fail "JARVIS local session login failed"
fi
http_check "Hermes models" "http://127.0.0.1:8642/v1/models" "$HERMES_TOKEN"
http_check "OpenClaw models" "http://127.0.0.1:18789/v1/models" "$OPENCLAW_TOKEN"
http_check "n9router models" "http://127.0.0.1:20128/v1/models" "$NINEROUTER_TOKEN"

section "Public route"
if [[ -z "$PUBLIC_GATEWAY" ]]; then
  warn "JCORE_PUBLIC_ORIGIN is not configured; skipped public tunnel check"
else
  public_host="${PUBLIC_GATEWAY#*://}"
  public_host="${public_host%%/*}"
  public_host="${public_host%%:*}"
  if getent ahosts "$public_host" >/dev/null 2>&1; then
    pass "$public_host resolves in system DNS"
  else
    fail "$public_host does not resolve in system DNS"
  fi
  PUBLIC_COOKIE_FILE="$(mktemp)"
  trap 'rm -f -- "$JCORE_COOKIE_FILE" "$PUBLIC_COOKIE_FILE"' EXIT
  if [[ -n "$JCORE_AUTH_PASSWORD" ]] && login_cookie "$PUBLIC_GATEWAY" "${JCORE_AUTH_USERNAME:-admin}" "$JCORE_AUTH_PASSWORD" "$PUBLIC_COOKIE_FILE"; then
    pass "JARVIS public session login works"
    http_check "JARVIS public health" "$PUBLIC_GATEWAY/health" "" "$PUBLIC_COOKIE_FILE"
  else
    fail "JARVIS public session login failed"
  fi
fi

printf '\nSummary: %s%d pass%s, %s%d warning%s, %s%d fail%s\n' \
  "$GREEN" "$PASS_COUNT" "$RESET" \
  "$YELLOW" "$WARN_COUNT" "$RESET" \
  "$RED" "$FAIL_COUNT" "$RESET"

if (( FAIL_COUNT > 0 )); then
  exit 1
fi
