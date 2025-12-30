# ---------------------------------------
# Stage 1: Install Dependencies
# ---------------------------------------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install

# ---------------------------------------
# Stage 2: Build Application
# ---------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma & Build
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# ---------------------------------------
# Stage 3: Production Runner (Run as Root)
# ---------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# --- สำคัญ: Copy ไฟล์โดยให้เจ้าของเป็น Root (ไม่ต้องใส่ --chown) ---
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# --- สำคัญ: ลบบรรทัด USER nodejs ทิ้งไปเลย ---

EXPOSE 3001

CMD ["node", "dist/server.js"]