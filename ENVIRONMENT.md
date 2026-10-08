# 🌐 Soil Mates Environment Configuration Reference

This document outlines all runtime configuration parameters across frontend and backend tiers.

## Configuration Matrix

| Variable | Tier | Scope | Required | Default | Description |
|---|---|---|---|---|---|
| `PORT` | Backend | Server | No | `3000` | Port for unified Express + Vite web application |
| `BACKEND_PORT` | Backend | Server | No | `4000` | Port for standalone backend daemon |
| `NODE_ENV` | Both | Runtime | No | `development` | Environment mode (`development` or `production`) |
| `MONGODB_URI` | Backend | Database | No | `mongodb://localhost:27017/soilmates` | MongoDB connection string. If omitted/unreachable, in-memory store activates |
| `MONGODB_DB` | Backend | Database | No | `soilmates` | Primary database name |
| `GEMINI_API_KEY` | Backend | AI | **Yes (for live AI)** | `""` | Google Gemini API key. Secret must never be exposed to frontend |
| `AUTH_SECRET` | Backend | Security | **Yes (in prod)** | `soil-mates-super-secret-jwt-key-2026` | Secret used for HMAC SHA-256 JWT signing |
| `CORS_ORIGIN` | Backend | Security | No | `*` | Allowed CORS origin header |
| `VITE_API_BASE_URL` | Frontend | Client | No | `""` | API base URL for client fetch calls. Leave empty for same-origin proxy |

---

## Secret Management Best Practices
1. **Never commit `.env` to version control**: `.env` is listed in `.gitignore`.
2. **Never prefix secrets with `VITE_`**: Any variable prefixed with `VITE_` is baked into the public JavaScript bundle downloaded by browsers.
3. **Use AI Studio Secrets or Secret Manager**: In production cloud deployments, store `GEMINI_API_KEY` and `AUTH_SECRET` via managed secret stores.
