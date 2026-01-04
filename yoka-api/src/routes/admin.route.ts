import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import {
  getBookingList,
  getDashboardStats,
  updateProfileController,
} from "../controllers/admin.controller";

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
  updateProfileController
);

export default router;
