.PHONY: dev dev-backend dev-frontend build lint seed migrate

# Start backend (:6004) + frontend (:6003) together — open http://localhost:6003
dev:
	@echo "🚀 backend on :6004, frontend on :6003 — open http://localhost:6003"
	@trap 'kill 0' INT TERM; \
		cd backend && pnpm dev & \
		cd frontend && pnpm dev & \
		wait

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
