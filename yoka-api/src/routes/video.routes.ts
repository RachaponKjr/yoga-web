import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import {
  createVideoPreview,
  getVideoPreview,
  updateVideoPreview,
} from "../controllers/video.controller";

const router = Router();

// ส่งข้อมูลมาสร้าง (Admin เท่านั้น)
router.post("/create", authMiddleware, restrictTo("Admin"), createVideoPreview);

// ดึงข้อมูลไปแสดง (User/Admin ดูได้หมด)
router.get("/get", getVideoPreview);

router.patch(
  "/update",
  authMiddleware,
  restrictTo("Admin"),
  updateVideoPreview,
);

export default router;
