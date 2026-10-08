# Production Multi-Stage Dockerfile for Soil Mates Full-Stack
FROM node:22-bookworm-slim AS base
WORKDIR /app

# Dependencies Stage
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

# Build Stage
FROM deps AS builder
COPY . .
RUN npm run build

# Production Runner Stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV BACKEND_PORT=4000

COPY --from=builder /app /app

EXPOSE 3000
EXPOSE 4000

CMD ["npm", "start"]
