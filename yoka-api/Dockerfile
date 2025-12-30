# ---------------------------------------
# Stage 1: Install Dependencies
# ---------------------------------------
FROM node:20-alpine AS deps
# Backend จำเป็นต้องลง openssl เพิ่มสำหรับ Prisma
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy เฉพาะไฟล์ package (ไม่มี lockfile ตามที่คุณทำไว้)
COPY package.json ./
# *** Backend ต้อง Copy โฟลเดอร์ prisma ด้วย ***
COPY prisma ./prisma/

RUN npm install

# ---------------------------------------
# Stage 2: Build Application
# ---------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# *** จุดสำคัญที่แก้ Error: ต้อง Generate Prisma Client ก่อน Build ***
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

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

USER nodejs

EXPOSE 3001

CMD ["node", "dist/server.js"]