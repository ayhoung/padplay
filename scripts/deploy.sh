#!/usr/bin/env bash
set -euo pipefail

HOST="${HOST:-ubuntu@13.213.86.62}"
APP_DIR="${APP_DIR:-/home/ubuntu/tabletgaming}"
BRANCH="${BRANCH:-main}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-0}"

ssh "$HOST" "source ~/.nvm/nvm.sh && \
  cd $APP_DIR && \
  git fetch origin && \
  git checkout $BRANCH && \
  git reset --hard origin/$BRANCH && \
  pnpm install --frozen-lockfile && \
  if [ \"$RUN_MIGRATIONS\" = \"1\" ]; then cd backend && pnpm migrate && cd ..; fi && \
  pnpm -r build && \
  pm2 restart tabletgaming-backend tabletgaming-frontend"

curl -fsS https://padplay.app/api/health
curl -fsS -o /dev/null https://padplay.app/
