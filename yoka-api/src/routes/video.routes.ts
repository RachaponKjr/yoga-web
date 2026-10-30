import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import {
  createVideoPreview,
  getVideoPreview,
  updateVideoPreview,
} from "../controllers/video.controller";
import multer from "multer";
import { RequestHandler } from "express";
import { AppError } from "../utils/AppError";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 8 } }).single("cover_image");
const uploadSchedule: RequestHandler = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) return next(new AppError(error.code === "LIMIT_FILE_SIZE" ? "ภาพต้องมีขนาดไม่เกิน 5 MB" : "อัปโหลดภาพไม่สำเร็จ กรุณาเลือกภาพเดียว", 400));
    next();
  });
};

const router = Router();

// ส่งข้อมูลมาสร้าง (Admin เท่านั้น)
router.post("/create", authMiddleware, restrictTo("Admin"), uploadSchedule, createVideoPreview);

// ดึงข้อมูลไปแสดง (User/Admin ดูได้หมด)
router.get("/get", getVideoPreview);

router.patch(
  "/update",
  authMiddleware,
  restrictTo("Admin"),
  uploadSchedule,
  updateVideoPreview,
);

export default router;
