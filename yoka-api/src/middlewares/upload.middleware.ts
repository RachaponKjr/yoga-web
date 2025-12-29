// src/middlewares/upload.middleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";

export const createUploader = (subfolder: string) => {
  // 1. กำหนด Path หลัก + ชื่อ Folder ย่อย
  const uploadDir = path.join("uploads", subfolder);

  // 2. สร้าง Folder อัตโนมัติถ้ายังไม่มี (recursive: true จะช่วยสร้าง path ซ้อนกันได้)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 3. Config Storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir); // เก็บไฟล์ใน folder ที่ส่งเข้ามา
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
      );
    },
  });

  // 4. Config Filter (Optional: ปรับให้รับไฟล์อื่นนอกจากรูปได้ถ้าต้องการ)
  const fileFilter = (req: any, file: any, cb: any) => {
    // ตัวอย่าง: ยอมรับเฉพาะรูปภาพ
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"), false);
    }
  };

  // 5. Return multer instance กลับไป
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
};
