"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const removeFile = (filePath) => {
    try {
        // 1. จัดการ Path ให้ถูกต้อง (ระวังเรื่อง absolute/relative path)
        // สมมติใน DB เก็บเป็น "uploads/avatar/xxx.jpg"
        // เราต้องต่อ path ให้เริ่มจาก root ของโปรเจกต์
        const fullPath = path_1.default.join(process.cwd(), filePath);
        // 2. เช็คว่ามีไฟล์จริงไหม
        if (fs_1.default.existsSync(fullPath)) {
            // 3. สั่งลบ
            fs_1.default.unlinkSync(fullPath);
            console.log(`Deleted file: ${fullPath}`);
        }
    }
    catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
    }
};
exports.removeFile = removeFile;
