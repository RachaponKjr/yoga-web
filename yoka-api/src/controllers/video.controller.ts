import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as videoService from "../services/video.service";

// สำหรับการดึงข้อมูลวิดีโอไปแสดงผล (GET)
export const getVideoPreview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // ดึงข้อมูลล่าสุดอันเดียวจาก Database
    const data = await videoService.getVideoService();
    res.status(StatusCodes.OK).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

// สำหรับการอัปเดตหรือสร้างข้อมูลใหม่ (POST)
export const createVideoPreview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { url_1, url_2, url_3, url_4 } = req.body;

    // ตรวจสอบเบื้องต้นว่าส่งค่ามาครบไหม
    if (!url_1 || !url_2 || !url_3 || !url_4) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide all 4 URLs",
      });
    }

    const data = await videoService.createVideoService({
      payload: { url_1, url_2, url_3, url_4 },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVideoPreview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { url_1, url_2, url_3, url_4, id } = req.body;

    if (!url_1 || !url_2 || !url_3 || !url_4) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide all 4 URLs",
      });
    }

    const data = await videoService.updateVideoService({
      payload: { url_1, url_2, url_3, url_4, id },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
