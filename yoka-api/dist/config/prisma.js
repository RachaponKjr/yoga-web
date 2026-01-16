"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/prisma.ts
const client_1 = require("@prisma/client");
const env_1 = require("./env");
const prisma = global.prisma ||
    new client_1.PrismaClient({
        log: env_1.config.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
    });
if (env_1.config.nodeEnv !== "production") {
    global.prisma = prisma;
}
exports.default = prisma;
