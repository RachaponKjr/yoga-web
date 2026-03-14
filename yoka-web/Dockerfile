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

# --- แก้ไขจุดที่ 1: เอา package-lock.json ออก ---
COPY package.json ./

# --- แก้ไขจุดที่ 2: เปลี่ยนเป็น install ธรรมดา ---
RUN npm install

# ---------------------------------------
# Stage 3: Builder (สร้างไฟล์ Build)
# ---------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ป้องกัน Next.js ส่ง Telemetry data
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js
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

# Copy โฟลเดอร์ public
COPY --from=builder /app/public ./public

# Copy ไฟล์ Standalone ที่ Next.js สร้างให้
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT 3001
CMD ["node", "server.js"]