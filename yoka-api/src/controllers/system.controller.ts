import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as systemService from "../services/system.service";

export const checkHealth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const healthData = systemService.getSystemHealth();
    res.status(StatusCodes.OK).json({
      success: true,
      data: healthData,
    });
  } catch (error) {
    next(error); // ส่ง error ไปให้ Global Error Handler
  }
};
