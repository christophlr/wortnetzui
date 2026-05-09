#!/usr/bin/env bash
PORT=5173
if ss -ltnp 2>/dev/null | grep -q ":$PORT "; then
  echo "Port $PORT already in use — not starting another server."
  exit 1
fi

# Use pnpm if available, otherwise npm
if command -v pnpm >/dev/null 2>&1; then
  pnpm dev -- --port $PORT
else
  npm run dev -- --port $PORT
fi
