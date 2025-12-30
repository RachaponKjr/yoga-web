# ---------------------------------------
# Stage 1: Install Dependencies
# ---------------------------------------
FROM node:20-alpine AS deps
# ติดตั้ง libc6-compat จำเป็นสำหรับ Prisma บน Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# --- แก้ไขจุดที่ 1: Copy แค่ package.json พอ (ตัด package-lock.json ออก) ---
COPY package.json ./
COPY prisma ./prisma/

# --- แก้ไขจุดที่ 2: เปลี่ยนเป็น install ธรรมดา (เพราะไม่มี lockfile) ---
RUN npm install

# ---------------------------------------
# Stage 2: Build Application
# ---------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 1. Generate Prisma Client
RUN npx prisma generate

# 2. Build code
RUN npm run build

# 3. Prune ให้เหลือแค่ Production Dependencies
# หมายเหตุ: ถ้าไม่มี lockfile คำสั่ง prune บางทีอาจทำงานไม่สมบูรณ์แต่ไม่ error
RUN npm prune --production

# ---------------------------------------
# Stage 3: Production Runner
# ---------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# สร้าง Group และ User เพื่อความปลอดภัย
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy ไฟล์ที่จำเป็นจาก Builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# เปลี่ยนไปใช้ User ธรรมดา
USER nodejs

EXPOSE 3000

# คำสั่งรัน
CMD ["node", "dist/main.js"]