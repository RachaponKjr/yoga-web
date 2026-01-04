# ใช้ Node Alpine ตัวเดียวจบ ไม่ต้องแยก Stage
FROM node:20-alpine

WORKDIR /app

# Copy และ Install Dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy Code และ Build
COPY . .
# รับค่า ENV ตอน Build (เหมือนเดิม)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ติดตั้งตัว "serve" เพื่อรันเว็บ
RUN npm install -g serve

# เปิด Port 3002
EXPOSE 3002

# รันคำสั่ง serve ไปที่โฟลเดอร์ dist
# -s คือ single page application (แก้ปัญหา refresh หน้าขาวให้เองเหมือน nginx)
CMD ["serve", "-s", "dist", "-l", "3002"]