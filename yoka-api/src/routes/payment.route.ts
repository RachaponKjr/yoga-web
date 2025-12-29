import { Router } from "express";
import { chargeCardController } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/checkout", authMiddleware, chargeCardController);

export default router;
