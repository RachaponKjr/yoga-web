import express from "express";
import { omiseWebhookController } from "../controllers/webhook.controller";

const router = express.Router();
router.post("/omise", omiseWebhookController);

export default router;
