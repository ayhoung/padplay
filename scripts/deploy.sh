#!/usr/bin/env bash
set -euo pipefail

HOST="${HOST:-ubuntu@13.213.86.62}"
BASE_DIR="${BASE_DIR:-/home/ubuntu}"
APP_LINK="${APP_LINK:-$BASE_DIR/tabletgaming}"
RELEASES_DIR="${RELEASES_DIR:-$BASE_DIR/releases}"
SHARED_DIR="${SHARED_DIR:-$BASE_DIR/shared}"
BRANCH="${BRANCH:-main}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-0}"

# Create the SSH command string
# 1. Create releases directory
# 2. Clone fresh code into timestamped directory
# 3. Symlink environment variables
# 4. Install dependencies and build
# 5. Swap the production symlink
# 6. Gracefully reload PM2 via ecosystem config
# 7. Cleanup old releases (keep last 5)
ssh "$HOST" "source ~/.nvm/nvm.sh && \
  TIMESTAMP=\$(date +%Y%m%d_%H%M%S) && \
  NEW_RELEASE_DIR=\"$RELEASES_DIR/\$TIMESTAMP\" && \
  mkdir -p $RELEASES_DIR $SHARED_DIR && \
  echo \"📦 Cloning new release: \$NEW_RELEASE_DIR\" && \
  git clone -b $BRANCH git@github.com:ayhoung/padplay.git \$NEW_RELEASE_DIR && \
  cd \$NEW_RELEASE_DIR && \
  echo \"🔗 Linking shared environment files...\" && \
  ln -sf $SHARED_DIR/backend.env backend/.env && \
  ln -sf $SHARED_DIR/frontend.env.local frontend/.env.local && \
  echo \"📦 Installing dependencies...\" && \
  pnpm install --frozen-lockfile && \
  if [ \"$RUN_MIGRATIONS\" = \"1\" ]; then echo \"🗄️ Running migrations...\"; cd backend && pnpm migrate && cd ..; fi && \
  echo \"🏗️ Building application...\" && \
  pnpm -r build && \
  echo \"🔄 Swapping production symlink...\" && \
  ln -sfn \$NEW_RELEASE_DIR $APP_LINK && \
  echo \"♻️ Reloading PM2...\" && \
  (pm2 reload $APP_LINK/ecosystem.config.js --update-env || pm2 start $APP_LINK/ecosystem.config.js) && \
  echo \"🧹 Cleaning up old releases...\" && \
  cd $RELEASES_DIR && ls -1tr | head -n -5 | xargs -d '\n' rm -rf --"

sleep 5

echo "🩺 Running Health Checks..."
curl -fsS https://padplay.app/api/health
curl -fsS -o /dev/null https://padplay.app/
echo -e "\n✅ Zero-Downtime Deployment Successful!"
