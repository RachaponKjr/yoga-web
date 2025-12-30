# ---------------------------------------
# Stage 1: Install Dependencies
# ---------------------------------------
FROM node:20-alpine AS deps
# เพิ่ม compat-openssl11 เพื่อรองรับ Prisma
RUN apk add --no-cache libc6-compat openssl compat-openssl11
WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install

# ---------------------------------------
# Stage 2: Build Application
# ---------------------------------------
FROM node:20-alpine AS builder
# ต้องลงใน Stage นี้ด้วยเพื่อให้ prisma generate ผ่าน
RUN apk add --no-cache libc6-compat openssl compat-openssl11
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

# *** สำคัญที่สุด: ต้องลง compat-openssl11 ในตัวรันจริงด้วย ***
RUN apk add --no-cache libc6-compat openssl compat-openssl11

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/server.js"]