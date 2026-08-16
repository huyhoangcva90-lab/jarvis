#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "Run this provisioner as root inside Ubuntu." >&2
  exit 1
fi

SOURCE_DIR="${1:-/mnt/d/test/j-core-console}"
APP_DIR="/opt/j-core-console"
SERVICE_USER="jcore"
SERVICE_HOME="/home/jcore"
CONFIG_DIR="$SERVICE_HOME/.config/j-core"
ENV_FILE="$CONFIG_DIR/j-core.env"
LAN_ADDRESS="${JCORE_LAN_ADDRESS:-}"
GATEWAY_BIND_HOST="127.0.0.1"
[[ -n "$LAN_ADDRESS" ]] && GATEWAY_BIND_HOST="0.0.0.0"
NODE_BIN="$SERVICE_HOME/.openclaw/tools/node/bin/node"
COREPACK_BIN="$SERVICE_HOME/.openclaw/tools/node/bin/corepack"

if [[ ! -f "$SOURCE_DIR/package.json" || ! -f "$SOURCE_DIR/server/gateway.mjs" ]]; then
  echo "Invalid J-Core source directory: $SOURCE_DIR" >&2
  exit 1
fi
if [[ ! -x "$NODE_BIN" || ! -x "$COREPACK_BIN" ]]; then
  echo "OpenClaw local Node runtime is missing from $SERVICE_HOME/.openclaw." >&2
  exit 1
fi
if [[ ! -x "$SERVICE_HOME/.hermes/hermes-agent/venv/bin/hermes" ]]; then
  echo "Hermes runtime is not installed for $SERVICE_USER." >&2
  exit 1
fi
if [[ ! -x "$SERVICE_HOME/.openclaw/tools/node/bin/9router" ]]; then
  echo "9Router runtime is not installed for $SERVICE_USER." >&2
  exit 1
fi

install -d -o "$SERVICE_USER" -g "$SERVICE_USER" "$APP_DIR" "$CONFIG_DIR"
rsync -a --delete \
  --exclude='.git/' --exclude='.agents/' --exclude='.codex/' --exclude='node_modules/' \
  --exclude='.pnpm-store/' --exclude='.env.local' --exclude='.jcore/' \
  "$SOURCE_DIR/" "$APP_DIR/"
chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"

runuser -u "$SERVICE_USER" -- env \
  HOME="$SERVICE_HOME" \
  PATH="$SERVICE_HOME/.openclaw/tools/node/bin:/usr/local/bin:/usr/bin:/bin" \
  "$COREPACK_BIN" pnpm install --dir "$APP_DIR" --frozen-lockfile
runuser -u "$SERVICE_USER" -- env \
  HOME="$SERVICE_HOME" \
  PATH="$SERVICE_HOME/.openclaw/tools/node/bin:/usr/local/bin:/usr/bin:/bin" \
  "$COREPACK_BIN" pnpm --dir "$APP_DIR" run build

if [[ ! -f "$ENV_FILE" ]]; then
  LOGIN_NAME="${JCORE_AUTH_USERNAME:-admin}"
  LOGIN_PASSWORD="${JCORE_AUTH_PASSWORD:-$(od -An -N24 -tx1 /dev/urandom | tr -d ' \n')}"
  umask 077
  {
    printf 'JCORE_GATEWAY_HOST=%s\n' "$GATEWAY_BIND_HOST"
    printf 'JCORE_GATEWAY_PORT=8787\n'
    printf 'JCORE_NATIVE_DASHBOARD_PROXY_HOST=127.0.0.1\n'
    printf 'JCORE_AUTH_USERNAME=%s\n' "$LOGIN_NAME"
    printf 'JCORE_AUTH_PASSWORD=%s\n' "$LOGIN_PASSWORD"
    printf 'JCORE_WEB_ROOT=%s\n' "$APP_DIR/dist"
    printf 'JCORE_WORKSPACE_ROOT=%s\n' "$SERVICE_HOME"
    printf 'JCORE_WORKSPACE_WRITE_ENABLED=true\n'
    printf 'JCORE_APP_CONFIG_WRITE_ENABLED=true\n'
    printf 'JCORE_TERMINAL_ENABLED=true\n'
    printf 'JCORE_TERMINAL_PRIVATE_MODE=false\n'
    printf 'JCORE_TERMINAL_SHELL=/bin/bash\n'
    printf 'HERMES_BASE_URL=%s\n' "${HERMES_BASE_URL:-http://127.0.0.1:8642}"
    printf 'HERMES_HEALTH_URL=%s\n' "${HERMES_HEALTH_URL:-http://127.0.0.1:8642/v1/models}"
    printf 'HERMES_CHAT_URL=%s\n' "${HERMES_CHAT_URL:-http://127.0.0.1:8642/v1/chat/completions}"
    printf 'OPENCLAW_BASE_URL=http://127.0.0.1:18789\n'
    printf 'OPENCLAW_HEALTH_URL=http://127.0.0.1:18789/v1/models\n'
    printf 'NINEROUTER_BASE_URL=http://127.0.0.1:20128\n'
    printf 'NINEROUTER_HEALTH_URL=http://127.0.0.1:20128/v1/models\n'
    printf 'NINEROUTER_CHAT_URL=http://127.0.0.1:20128/v1/chat/completions\n'
    printf 'JCORE_HERMES_CONFIG_PATH=%s\n' "$SERVICE_HOME/.hermes/config.yaml"
    printf 'JCORE_OPENCLAW_CONFIG_PATH=%s\n' "$SERVICE_HOME/.openclaw/openclaw.json"
    printf 'JCORE_9ROUTER_CONFIG_PATH=%s\n' "$SERVICE_HOME/.config/j-core/apps/9router.json"
  } > "$ENV_FILE"
  chown "$SERVICE_USER:$SERVICE_USER" "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  printf 'username=%s\npassword=%s\n' "$LOGIN_NAME" "$LOGIN_PASSWORD" > "$CONFIG_DIR/initial-login.txt"
  chown "$SERVICE_USER:$SERVICE_USER" "$CONFIG_DIR/initial-login.txt"
  chmod 600 "$CONFIG_DIR/initial-login.txt"
fi

if [[ -n "$LAN_ADDRESS" ]]; then
  if ! [[ "$LAN_ADDRESS" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then
    echo "JCORE_LAN_ADDRESS must be an IPv4 address, received: $LAN_ADDRESS" >&2
    exit 1
  fi
  sed -i 's/^JCORE_GATEWAY_HOST=.*/JCORE_GATEWAY_HOST=0.0.0.0/' "$ENV_FILE"
  if grep -q '^JCORE_CORS_ORIGIN=' "$ENV_FILE"; then
    sed -i "s|^JCORE_CORS_ORIGIN=.*|JCORE_CORS_ORIGIN=http://$LAN_ADDRESS:8787|" "$ENV_FILE"
  else
    printf 'JCORE_CORS_ORIGIN=http://%s:8787\n' "$LAN_ADDRESS" >> "$ENV_FILE"
  fi
fi

ROUTER_ENV_FILE="$CONFIG_DIR/9router.env"
if [[ ! -f "$ROUTER_ENV_FILE" ]]; then
  ROUTER_SECRET="$(od -An -N32 -tx1 /dev/urandom | tr -d ' \n')"
  umask 077
  {
    printf 'INITIAL_PASSWORD=%s\n' "$ROUTER_SECRET"
    printf 'NINEROUTER_DASHBOARD_PASSWORD=%s\n' "$ROUTER_SECRET"
  } > "$ROUTER_ENV_FILE"
  chown "$SERVICE_USER:$SERVICE_USER" "$ROUTER_ENV_FILE"
  chmod 600 "$ROUTER_ENV_FILE"
fi

install -m 0644 "$APP_DIR/deploy/ubuntu/hermes-dashboard.service" /etc/systemd/system/hermes-dashboard.service
install -m 0644 "$APP_DIR/deploy/ubuntu/openclaw.service" /etc/systemd/system/openclaw.service
install -m 0644 "$APP_DIR/deploy/ubuntu/9router.service" /etc/systemd/system/9router.service
install -m 0644 "$APP_DIR/deploy/ubuntu/j-core.service" /etc/systemd/system/j-core.service

systemctl daemon-reload
systemctl enable hermes-dashboard.service openclaw.service 9router.service j-core.service
systemctl restart hermes-dashboard.service openclaw.service 9router.service j-core.service

echo "J-Core runtime provisioned:"
systemctl --no-pager --full status hermes-dashboard.service openclaw.service 9router.service j-core.service | sed -n '1,80p'
