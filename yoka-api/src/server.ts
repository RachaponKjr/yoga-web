import app from "./app";
import { config } from "./config/env";
import logger from "./utils/logger";

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

// Graceful Shutdown (จัดการกรณีปิดเซิร์ฟเวอร์กระทันหัน)
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
  });
});
