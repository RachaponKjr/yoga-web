import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import {
  getBookingList,
  getDashboardStats,
} from "../controllers/admin.controller";
import { createUploader } from "../middlewares/upload.middleware";
import { updateProfileController } from "../controllers/auth.controller";

const router = Router();

router.get("/stats", authMiddleware, restrictTo("Admin"), getDashboardStats);
router.get(
  "/booking-last",
  authMiddleware,
  restrictTo("Admin"),
  getBookingList
);

router.patch(
  "/update-profile/:id",
  authMiddleware,
  restrictTo("Admin"),
  createUploader("avatar").single("avatar"),
  updateProfileController
);

export default router;
