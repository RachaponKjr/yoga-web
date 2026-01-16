"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = env_1.config.port;
const server = app_1.default.listen(PORT, () => {
    logger_1.default.info(`🚀 Server running on port ${PORT} in ${env_1.config.nodeEnv} mode`);
});
// Graceful Shutdown (จัดการกรณีปิดเซิร์ฟเวอร์กระทันหัน)
process.on("SIGTERM", () => {
    logger_1.default.info("SIGTERM received. Shutting down gracefully");
    server.close(() => {
        logger_1.default.info("Process terminated");
    });
});
