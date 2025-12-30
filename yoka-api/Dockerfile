# ---------------------------------------
# Stage 1: Install Dependencies
# ---------------------------------------
FROM node:20-alpine AS deps
# ลบ compat-openssl11 ออก เพราะมันไม่มีให้โหลด
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install

# ---------------------------------------
# Stage 2: Build Application
# ---------------------------------------
FROM node:20-alpine AS builder
# ลบ compat-openssl11 ออก
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate & Build
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# ---------------------------------------
# Stage 3: Production Runner (Root)
# ---------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# ลบ compat-openssl11 ออก
RUN apk add --no-cache libc6-compat openssl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/server.js"]