import express from "express";
import { omiseWebhookController } from "../controllers/webhook.controller";

const router = express.Router();

// ⚠️ ห้ามใส่ authMiddleware เด็ดขาด! Omise คือระบบภายนอก ไม่ใช่ User ที่ Login
router.post("/omise", omiseWebhookController);

export default router;
