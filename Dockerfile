# syntax=docker/dockerfile:1
# Image de production Diabaction Congo (Next.js 14 + Prisma).
# Build multi-étapes ; les migrations sont appliquées au démarrage (entrypoint).

FROM node:20-slim AS base
WORKDIR /app
# OpenSSL est requis par le moteur de requêtes Prisma.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# ── Dépendances ──────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ── Build ────────────────────────────────────────────────────────────────────
FROM base AS builder
# Clé publique VAPID : injectée à la compilation (variables NEXT_PUBLIC_* inlinées).
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY=""
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY=$NEXT_PUBLIC_VAPID_PUBLIC_KEY
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# ── Runner ───────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# node_modules complet conservé : le client Prisma + la CLI (migrate deploy) sont requis au runtime.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]
