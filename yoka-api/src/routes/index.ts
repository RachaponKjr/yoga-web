import { Router } from "express";
import * as systemController from "../controllers/system.controller";

const router = Router();

// Prefix: /api/v1/health
router.get("/health", systemController.checkHealth);

export default router;
