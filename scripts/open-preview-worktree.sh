#!/usr/bin/env bash
# Mevcut local checkout'u değiştirmeden güncel Cloud branch'ini ayrı klasör + port'ta açar.
# Kullanım (kendi bilgisayarınızda, mevcut repo kökünden):
#   bash scripts/open-preview-worktree.sh
# veya:
#   bash scripts/open-preview-worktree.sh 5002

set -euo pipefail

PORT="${1:-5002}"
BRANCH="${PREVIEW_BRANCH:-cursor/cloud-agent-1783986237872-d3m85}"
ROOT="$(git rev-parse --show-toplevel)"
PARENT="$(dirname "$ROOT")"
TARGET="${PARENT}/sultanokullari-preview-${PORT}"
WT_BRANCH="cursor/local-preview-${PORT}-ad25"

echo "==> Kaynak repo: $ROOT (dokunulmayacak)"
echo "==> Preview klasör: $TARGET"
echo "==> Port: $PORT"

git -C "$ROOT" fetch origin "$BRANCH"

if [ -d "$TARGET" ]; then
  echo "==> Worktree zaten var, güncelleniyor..."
  git -C "$TARGET" fetch origin
  git -C "$TARGET" checkout "$WT_BRANCH" 2>/dev/null || true
  git -C "$TARGET" reset --hard "origin/$BRANCH"
else
  # Aynı branch iki worktree'de olamaz → yeni local branch adı ile aynı commit
  git -C "$ROOT" worktree add -B "$WT_BRANCH" "$TARGET" "origin/$BRANCH"
fi

if [ -f "$ROOT/.env.local" ] && [ ! -f "$TARGET/.env.local" ]; then
  cp "$ROOT/.env.local" "$TARGET/.env.local"
fi

if [ -f "$TARGET/.env.local" ]; then
  if grep -q '^NEXT_PUBLIC_SERVER_URL=' "$TARGET/.env.local"; then
    sed -i.bak "s|^NEXT_PUBLIC_SERVER_URL=.*|NEXT_PUBLIC_SERVER_URL=http://localhost:${PORT}|" "$TARGET/.env.local"
  else
    echo "NEXT_PUBLIC_SERVER_URL=http://localhost:${PORT}" >> "$TARGET/.env.local"
  fi
fi

cd "$TARGET"
if [ ! -d node_modules ]; then
  npm install
fi

echo "==> Açılıyor: http://localhost:${PORT}/admin"
echo "==> Eski checkout'unuz ($ROOT) aynı kaldı."
exec npx next dev -p "$PORT" --webpack
