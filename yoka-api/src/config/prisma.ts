// src/config/prisma.ts
import { PrismaClient } from "@prisma/client";
import { config } from "./env";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      config.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (config.nodeEnv !== "production") {
  global.prisma = prisma;
}

export default prisma;
