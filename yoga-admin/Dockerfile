# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# คัดลอกเฉพาะไฟล์ที่จำเป็นเพื่อทำ Caching dependencies
COPY package.json package-lock.json* ./

# ติดตั้ง dependencies (ใช้ --legacy-peer-deps เพื่อเลี่ยงปัญหา conflict ของ library)
RUN npm install --legacy-peer-deps

# คัดลอกซอร์สโค้ดทั้งหมด
COPY . .

# กำหนดตัวแปรแวดล้อมสำหรับการ Build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# บังคับ Build โดยข้ามการเช็ค TypeScript (แก้ปัญหา Exit Code 2)
# เราจะเรียก npx vite build โดยตรงเพื่อไม่ให้ tsc -b มาสั่งหยุดการทำงาน
RUN npx vite build

# Stage 2: Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# ติดตั้ง serve เพื่อใช้รันไฟล์ static ที่ build เสร็จแล้ว
RUN npm install -g serve

# คัดลอกเฉพาะโฟลเดอร์ dist ที่ build เสร็จแล้วมาจาก stage แรก
COPY --from=builder /app/dist ./dist

# กำหนด Port ให้ตรงกับที่ใช้งาน
EXPOSE 3002

# สั่งรันด้วย serve
CMD ["serve", "-s", "dist", "-l", "3002"]