# syntax=docker/dockerfile:1

FROM node:26.12.1-bookworm-slim AS base
# Node 25+ no longer bundles corepack, so install it explicitly
RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@11.22.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM mcr.microsoft.com/playwright:v1.62.1-noble AS runner
# Replace the image's bundled Node with patched Node 26 (Oct 21 2026 security release, CVE-2026-111497)
COPY --from=node:26.12.1-bookworm-slim /usr/local/bin/node /usr/bin/node
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=deps /app/node_modules/.pnpm/playwright-core@1.62.1/node_modules/playwright-core ./node_modules/.pnpm/playwright-core@1.62.1/node_modules/playwright-core
COPY --from=deps /app/node_modules/.pnpm/playwright@1.62.1/node_modules/playwright ./node_modules/.pnpm/playwright@1.62.1/node_modules/playwright

RUN chown -R pwuser:pwuser /app
USER pwuser

EXPOSE 3000
CMD ["node", "server.js"]
