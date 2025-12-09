# =====================================================
# Stage 1: Install dependencies
# =====================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

# =====================================================
# Stage 2: Build the application
# =====================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build needs a placeholder JWT_SECRET (real one provided at runtime)
ENV NEXT_TELEMETRY_DISABLED=1
ENV JWT_SECRET="build-time-placeholder-not-used-in-runtime"
RUN npm run build

# Remove TypeScript and other dev-only packages from standalone
# These are not needed at runtime
RUN rm -rf .next/standalone/node_modules/typescript \
    && rm -rf .next/standalone/node_modules/@types \
    && rm -rf .next/standalone/node_modules/@img \
    && rm -rf .next/standalone/node_modules/sharp \
    && find .next/standalone -name "*.map" -delete \
    && find .next/standalone -name "*.d.ts" -delete

# =====================================================
# Stage 3: Production runtime (minimal)
# =====================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install su-exec and remove npm/yarn to reduce attack surface
RUN apk add --no-cache su-exec && \
    rm -rf /usr/local/lib/node_modules/npm && \
    rm -rf /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack && \
    rm -rf /opt/yarn* && \
    rm -rf /root/.npm /root/.node-gyp

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create directories with correct permissions
RUN mkdir -p public/uploads data .next && \
    chown -R nextjs:nodejs /app

# Copy ONLY the standalone build output (already cleaned in builder stage)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy entrypoint script
COPY --from=builder --chown=nextjs:nodejs /app/scripts/docker-entrypoint.sh ./scripts/
RUN chmod +x ./scripts/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
CMD ["node", "server.js"]
