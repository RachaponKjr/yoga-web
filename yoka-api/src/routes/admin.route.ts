import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import { getDashboardStats } from "../controllers/admin.controller";

const router = Router();

router.get("/stats", authMiddleware, restrictTo("Admin"), getDashboardStats);

export default router;
