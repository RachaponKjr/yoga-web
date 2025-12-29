# ---------------------------------------
# Stage 1: Base (เตรียมพื้นฐาน)
# ---------------------------------------
FROM node:20-alpine AS base

# ---------------------------------------
# Stage 2: Dependencies
# ---------------------------------------
FROM base AS deps
# libc6-compat จำเป็นสำหรับ libraries บางตัวใน Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------
# Stage 3: Builder (สร้างไฟล์ Build)
# ---------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ป้องกัน Next.js ส่ง Telemetry data (เพื่อความเป็นส่วนตัวและเร็วขึ้น)
ENV NEXT_TELEMETRY_DISABLED 1

# *** ถ้าคุณใช้ Prisma ต้อง Generate Client ก่อน Build ***
RUN npx prisma generate

# Build Next.js
# ถ้ามีตัวแปร NEXT_PUBLIC_... ที่ต้องใช้ตอน Build ให้ใส่ ARG ตรงนี้ได้เลย
RUN npm run build

# ---------------------------------------
# Stage 4: Runner (รันจริง)
# ---------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# สร้าง User เพื่อความปลอดภัย
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy โฟลเดอร์ public (รูปภาพ, fonts, etc.)
COPY --from=builder /app/public ./public

# Copy ไฟล์ Standalone ที่ Next.js สร้างให้ (ฉลาดมาก มันรวม node_modules ที่จำเป็นมาให้แล้ว)
# สังเกตการเปลี่ยน User เป็น nextjs เพื่อความปลอดภัย
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# ถ้าใช้ Standalone output เราจะรันไฟล์ server.js แทน npm start
CMD ["node", "server.js"]