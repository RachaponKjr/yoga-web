import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import {
  createVideoPreview,
  getVideoPreview,
  updateVideoPreview,
} from "../controllers/video.controller";
import { createUploader } from "../middlewares/upload.middleware";

const router = Router();

// ส่งข้อมูลมาสร้าง (Admin เท่านั้น)
router.post("/create", authMiddleware, restrictTo("Admin"), createVideoPreview);

// ดึงข้อมูลไปแสดง (User/Admin ดูได้หมด)
router.get("/get", getVideoPreview);

router.patch(
  "/update",
  authMiddleware,
  restrictTo("Admin"),
  createUploader("images").fields([{ name: "cover_image", maxCount: 1 }]),
  updateVideoPreview,
);

export default router;
