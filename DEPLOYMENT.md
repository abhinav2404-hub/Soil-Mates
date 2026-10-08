# 🚀 Soil Mates Deployment Guide

## 1. Supported Deployment Targets

### A. Google Cloud Run / AI Studio (Recommended)
Soil Mates is structured for single-container full-stack execution:
1. Ensure `package.json` specifies `"start": "tsx server.ts"` and `"build": "vite build"`.
2. Set environment variables:
   - `GEMINI_API_KEY` (automatically injected via AI Studio secrets)
   - `NODE_ENV=production`
   - `PORT=3000`
3. Build assets with `npm run build`.
4. Deploy the Cloud Run container.

### B. Docker Compose (Self-Hosted Linux / VM)
Deploy full-stack services including MongoDB on a standard VPS:
```bash
git clone <repo>
cd soilmates
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and AUTH_SECRET
docker-compose up -d --build
```

### C. Standard Node.js + Managed MongoDB (e.g. MongoDB Atlas)
```bash
# 1. Install production dependencies
npm ci

# 2. Compile frontend assets
npm run build

# 3. Set production environment
export NODE_ENV=production
export PORT=3000
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/soilmates"
export GEMINI_API_KEY="your-gemini-key"

# 4. Start production process
npm start
```

---

## 2. Health & Readiness Verification
Check endpoint availability:
```bash
curl -f http://localhost:3000/api/health
```

Expected status output:
```json
{"status":"UP","service":"Soil Mates Agricultural API","database":"connected","version":"1.0.0"}
```
