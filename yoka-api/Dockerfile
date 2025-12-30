# ---------------------------------------
# Stage 1: Install Dependencies
# ---------------------------------------
FROM node:20-alpine AS deps
# Backend จำเป็นต้องลง openssl เพิ่มสำหรับ Prisma
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy เฉพาะไฟล์ package
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

# Generate Prisma Client
RUN npx prisma generate

# Build code
RUN npm run build

# Prune dependencies
RUN npm prune --production

# ---------------------------------------
# Stage 3: Production Runner
# ---------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# --- จุดที่แก้ไข: ปิดการสร้าง User (เพื่อให้รันเป็น Root) ---
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nodejs

# --- จุดที่แก้ไข: เอา --chown ออก (เพื่อให้ไฟล์เป็นของ root) ---
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# --- จุดที่แก้ไข: ปิดคำสั่งสลับ User ---
# USER nodejs

EXPOSE 3001

CMD ["node", "dist/server.js"]