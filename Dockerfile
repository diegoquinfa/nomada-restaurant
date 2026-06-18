# ============================================================
# Stage 1: Install dependencies & build
# ============================================================
FROM node:24-alpine AS builder

# pnpm
RUN corepack enable && corepack prepare pnpm@11 --activate
WORKDIR /app

# Dependencies first (cache layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Source code
COPY . .

# Build SSR + static output (Nitro)
RUN pnpm build

# ============================================================
# Stage 2: Production — Nitro standalone server
# ============================================================
FROM node:24-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Only what's needed to run
COPY --from=builder /app/.output ./.output

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

CMD ["node", ".output/server/index.mjs"]
