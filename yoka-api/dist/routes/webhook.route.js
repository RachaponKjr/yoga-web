"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhook_controller_1 = require("../controllers/webhook.controller");
const router = express_1.default.Router();
// ⚠️ ห้ามใส่ authMiddleware เด็ดขาด! Omise คือระบบภายนอก ไม่ใช่ User ที่ Login
router.post("/omise", webhook_controller_1.omiseWebhookController);
exports.default = router;
