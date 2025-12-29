// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (err instanceof ZodError) {
    const errorMessage = err.issues
      .map((e) => `${e.path.join(".")} : ${e.message}`)
      .join(", ");
    error = new AppError(errorMessage, StatusCodes.BAD_REQUEST);
  }

  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || "Something went wrong";

  logger.error(
    `[${req.method}] ${req.originalUrl} >> StatusCode:: ${statusCode}, Message:: ${message}`
  );

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    // ถ้าเป็น Dev ให้ส่ง Stack Trace ไปด้วยจะได้แก้บั๊กง่ายๆ
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
