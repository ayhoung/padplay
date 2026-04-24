.PHONY: dev dev-backend dev-frontend dev-tunnel build lint seed migrate

TUNNEL_HOST ?= ubuntu@13.213.86.62
TUNNEL_PORT ?= 5433

# SSH tunnel to Lightsail Postgres + backend (:6004) + frontend (:6003)
# Ctrl+C kills everything (tunnel included)
dev:
	@echo "🧹  Clearing stale processes on :$(TUNNEL_PORT) :6003 :6004…"
	@lsof -ti :$(TUNNEL_PORT) | xargs kill -9 2>/dev/null || true
	@lsof -ti :6003        | xargs kill -9 2>/dev/null || true
	@lsof -ti :6004        | xargs kill -9 2>/dev/null || true
	@echo "🔌  Tunnelling Postgres → localhost:$(TUNNEL_PORT) via $(TUNNEL_HOST)"
	@echo "🚀  Backend :6004  ·  Frontend :6003  →  http://localhost:6003"
	@trap 'kill 0' INT TERM; \
		ssh -N -L $(TUNNEL_PORT):localhost:5432 $(TUNNEL_HOST) & \
		sleep 1; \
		(cd backend && pnpm dev) & \
		(cd frontend && pnpm dev) & \
		wait

# Tunnel only — useful when backend/frontend are already running separately
dev-tunnel:
	ssh -N -L $(TUNNEL_PORT):localhost:5432 $(TUNNEL_HOST)

dev-backend:
	cd backend && pnpm dev

dev-frontend:
	cd frontend && pnpm dev

build:
	pnpm -r build

lint:
	pnpm -r lint

migrate:
	cd backend && pnpm migrate

seed:
	cd backend && pnpm seed
