"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../utils/AppError");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    let error = err;
    if (err instanceof zod_1.ZodError) {
        const errorMessage = err.issues
            .map((e) => `${e.path.join(".")} : ${e.message}`)
            .join(", ");
        error = new AppError_1.AppError(errorMessage, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const statusCode = error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "Something went wrong";
    logger_1.default.error(`[${req.method}] ${req.originalUrl} >> StatusCode:: ${statusCode}, Message:: ${message}`);
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        // ถ้าเป็น Dev ให้ส่ง Stack Trace ไปด้วยจะได้แก้บั๊กง่ายๆ
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.errorHandler = errorHandler;
