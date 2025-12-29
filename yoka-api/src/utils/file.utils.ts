import fs from "fs";
import path from "path";

export const removeFile = (filePath: string) => {
  try {
    // 1. จัดการ Path ให้ถูกต้อง (ระวังเรื่อง absolute/relative path)
    // สมมติใน DB เก็บเป็น "uploads/avatar/xxx.jpg"
    // เราต้องต่อ path ให้เริ่มจาก root ของโปรเจกต์
    const fullPath = path.join(process.cwd(), filePath);

    // 2. เช็คว่ามีไฟล์จริงไหม
    if (fs.existsSync(fullPath)) {
      // 3. สั่งลบ
      fs.unlinkSync(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    }
  } catch (err) {
    console.error(`Error deleting file: ${filePath}`, err);
  }
};
