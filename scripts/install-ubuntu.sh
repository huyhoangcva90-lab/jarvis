#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="${JCORE_INSTALL_DIR:-$HOME/.local/share/j-core-console}"
ENV_FILE="$APP_DIR/.env.local"
UNIT_DIR="$HOME/.config/systemd/user"
UNIT_FILE="$UNIT_DIR/j-core.service"
LAN_ADDRESS="${JCORE_LAN_ADDRESS:-}"
GATEWAY_BIND_HOST="127.0.0.1"
[[ -n "$LAN_ADDRESS" ]] && GATEWAY_BIND_HOST="0.0.0.0"

if [[ -n "$LAN_ADDRESS" ]] && ! [[ "$LAN_ADDRESS" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then
  echo "JCORE_LAN_ADDRESS must be an IPv4 address, received: $LAN_ADDRESS" >&2
  exit 1
fi

if [[ "$APP_DIR" != "$HOME/.local/share/j-core-console" && "$APP_DIR" != "$HOME/.local/share/j-core-console/"* ]]; then
  echo "Refusing an install target outside $HOME/.local/share/j-core-console" >&2
  exit 1
fi

echo "[1/5] Installing Ubuntu runtime packages..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl nodejs npm rsync

echo "[2/5] Copying the minimal application tree..."
mkdir -p "$APP_DIR"
rsync -a --delete \
  --exclude='.git/' --exclude='.github/' --exclude='.agents/' --exclude='.codex/' \
  --exclude='node_modules/' --exclude='.pnpm-store/' --exclude='dist/' --exclude='.env.local' --exclude='.jcore/' \
  "$SOURCE_DIR/" "$APP_DIR/"

echo "[3/5] Installing dependencies and building the local UI..."
cd "$APP_DIR"
npx --yes pnpm@11.16.0 install --frozen-lockfile
npx --yes pnpm@11.16.0 run build

if [[ ! -f "$ENV_FILE" ]]; then
  read -r -p "J-Core login name [admin]: " LOGIN_NAME
  LOGIN_NAME="${LOGIN_NAME:-admin}"
  read -r -s -p "J-Core password: " LOGIN_PASSWORD
  echo
  if [[ ${#LOGIN_PASSWORD} -lt 8 ]]; then
    echo "Password must contain at least 8 characters." >&2
    exit 1
  fi
  {
    printf 'JCORE_GATEWAY_HOST=%s\n' "$GATEWAY_BIND_HOST"
    printf 'JCORE_GATEWAY_PORT=8787\n'
    [[ -n "$LAN_ADDRESS" ]] && printf 'JCORE_CORS_ORIGIN=http://%s:8787\n' "$LAN_ADDRESS"
    printf 'JCORE_AUTH_USERNAME=%q\n' "$LOGIN_NAME"
    printf 'JCORE_AUTH_PASSWORD=%q\n' "$LOGIN_PASSWORD"
    printf 'JCORE_WEB_ROOT=%q\n' "$APP_DIR/dist"
    printf 'JCORE_WORKSPACE_ROOT=%q\n' "$HOME"
    printf 'JCORE_WORKSPACE_WRITE_ENABLED=true\n'
    printf 'JCORE_APP_CONFIG_WRITE_ENABLED=true\n'
    printf 'JCORE_TERMINAL_ENABLED=true\n'
    printf 'JCORE_TERMINAL_PRIVATE_MODE=false\n'
    [[ -f "$HOME/.hermes/config.yaml" ]] && printf 'JCORE_HERMES_CONFIG_PATH=%q\n' "$HOME/.hermes/config.yaml"
    [[ -f "$HOME/.config/hermes/config.yaml" ]] && printf 'JCORE_HERMES_CONFIG_PATH=%q\n' "$HOME/.config/hermes/config.yaml"
    [[ -f "$HOME/.openclaw/config.json" ]] && printf 'JCORE_OPENCLAW_CONFIG_PATH=%q\n' "$HOME/.openclaw/config.json"
    [[ -f "$HOME/.config/openclaw/config.json" ]] && printf 'JCORE_OPENCLAW_CONFIG_PATH=%q\n' "$HOME/.config/openclaw/config.json"
    [[ -f "$HOME/.9router/config.json" ]] && printf 'JCORE_9ROUTER_CONFIG_PATH=%q\n' "$HOME/.9router/config.json"
    [[ -f "$HOME/.config/9router/config.json" ]] && printf 'JCORE_9ROUTER_CONFIG_PATH=%q\n' "$HOME/.config/9router/config.json"
    [[ -f "$HOME/.claude/settings.json" ]] && printf 'JCORE_CLAUDE_CONFIG_PATH=%q\n' "$HOME/.claude/settings.json"
  } > "$ENV_FILE"
  chmod 600 "$ENV_FILE"
fi

if [[ -n "$LAN_ADDRESS" ]]; then
  sed -i 's/^JCORE_GATEWAY_HOST=.*/JCORE_GATEWAY_HOST=0.0.0.0/' "$ENV_FILE"
  if grep -q '^JCORE_CORS_ORIGIN=' "$ENV_FILE"; then
    sed -i "s|^JCORE_CORS_ORIGIN=.*|JCORE_CORS_ORIGIN=http://$LAN_ADDRESS:8787|" "$ENV_FILE"
  else
    printf 'JCORE_CORS_ORIGIN=http://%s:8787\n' "$LAN_ADDRESS" >> "$ENV_FILE"
  fi
fi

echo "[4/5] Creating the per-user Ubuntu service..."
mkdir -p "$UNIT_DIR"
NODE_BIN="$(command -v node)"
cat > "$UNIT_FILE" <<EOF
[Unit]
Description=J-Core private local appliance
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
EnvironmentFile=$ENV_FILE
ExecStart=$NODE_BIN $APP_DIR/server/gateway.mjs
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF

echo "[5/5] Starting J-Core..."
systemctl --user daemon-reload
systemctl --user enable j-core.service
systemctl --user restart j-core.service
JCORE_URL="http://${LAN_ADDRESS:-127.0.0.1}:8787"
echo "J-Core is ready at $JCORE_URL"
echo "Use: systemctl --user status j-core.service"
