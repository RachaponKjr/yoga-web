# ---------------------------------------
# Stage 1: Install Dependencies
# ---------------------------------------
FROM node:20-alpine AS deps
# ติดตั้ง libc6-compat จำเป็นสำหรับ Prisma บน Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy เฉพาะไฟล์ package เพื่อ install dependencies (ใช้ cache layer)
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies ทั้งหมด (รวม devDependencies เพื่อใช้ Build)
RUN npm ci

# ---------------------------------------
# Stage 2: Build Application
# ---------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 1. Generate Prisma Client
RUN npx prisma generate

# 2. Build code (เช่น tsc หรือ nest build) -> Output ไปที่ folder /dist
RUN npm run build

# 3. Prune ให้เหลือแค่ Production Dependencies (เพื่อลดขนาด Image)
RUN npm prune --production

# ---------------------------------------
# Stage 3: Production Runner
# ---------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# สร้าง Group และ User เพื่อความปลอดภัย (ไม่รันเป็น Root)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy ไฟล์ที่จำเป็นจาก Builder
# Copy folder ที่ build เสร็จแล้ว
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
# Copy node_modules ที่เหลือเฉพาะของ production
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
# Copy prisma schema เผื่อจำเป็นต้องใช้ runtime (บางกรณี)
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# เปลี่ยนไปใช้ User ธรรมดา
USER nodejs

EXPOSE 3000

# คำสั่งรัน (แก้ path ตามจริง เช่น dist/main.js หรือ dist/index.js)
CMD ["node", "dist/main.js"]