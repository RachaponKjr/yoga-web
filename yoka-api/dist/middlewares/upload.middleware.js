"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUploader = void 0;
// src/middlewares/upload.middleware.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createUploader = (subfolder) => {
    // 1. กำหนด Path หลัก + ชื่อ Folder ย่อย
    const uploadDir = path_1.default.join("uploads", subfolder);
    // 2. สร้าง Folder อัตโนมัติถ้ายังไม่มี (recursive: true จะช่วยสร้าง path ซ้อนกันได้)
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    // 3. Config Storage
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir); // เก็บไฟล์ใน folder ที่ส่งเข้ามา
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
        },
    });
    // 4. Config Filter (Optional: ปรับให้รับไฟล์อื่นนอกจากรูปได้ถ้าต้องการ)
    const fileFilter = (req, file, cb) => {
        // ตัวอย่าง: ยอมรับเฉพาะรูปภาพ
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only images are allowed!"), false);
        }
    };
    // 5. Return multer instance กลับไป
    return (0, multer_1.default)({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    });
};
exports.createUploader = createUploader;
