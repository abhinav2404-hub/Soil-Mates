# 🛡️ Soil Mates Security Architecture & Policy

## 1. Security Overview
Soil Mates adheres to strict security standards to protect agricultural trade integrity, user credentials, and proprietary AI endpoints.

---

## 2. Security Controls Implemented

### A. Server-Side AI Protection
- The Google Gemini API key (`GEMINI_API_KEY`) is stored strictly in server-side memory and referenced only by Node.js.
- Image uploads are inspected for size (< 8MB) and sanitized against allowed MIME types (`image/jpeg`, `image/png`, `image/webp`).
- No generative AI prompt execution or token generation occurs in the browser.

### B. Price & Inventory Integrity
- The backend recalculates order totals directly from the database for every checkout request.
- Frontend payload prices and totals are ignored, preventing client-side cart tampering.
- Inventory quantities are checked and decremented atomically during checkout to prevent double-spending or overselling.

### C. Role-Based Access Control (RBAC)
- All privileged endpoints require a verified JWT signed with `AUTH_SECRET`.
- Sensitive operations (e.g. creating product listings, viewing administrative analytics, deleting records) enforce strict role validation (`requireRole(['FARMER', 'ADMIN'])`).
- Non-admin callers receive HTTP 403 Forbidden on administrative endpoints.

### D. Network Hardening
- Helmet middleware enforces security headers across all responses.
- Structured JSON error handling masks raw internal stack traces from client exposure.
- Cross-Origin Resource Sharing (CORS) is configured explicitly.

---

## 3. Reporting Vulnerabilities
If you discover a security vulnerability in Soil Mates, please report it to `security@soilmates.in`.
