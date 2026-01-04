import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import {
  getBookingList,
  getDashboardStats,
} from "../controllers/admin.controller";

const router = Router();

router.get("/stats", authMiddleware, restrictTo("Admin"), getDashboardStats);
router.get(
  "/booking-last",
  authMiddleware,
  restrictTo("Admin"),
  getBookingList
);

export default router;
