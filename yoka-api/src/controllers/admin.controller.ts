import { Request, Response } from "express";
import {
  getBookingListService,
  getStatsService,
} from "../services/admin.service";

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. เรียก Service เพื่อดึงข้อมูล
    const stats = await getStatsService();

    // 2. ส่งข้อมูลกลับไป (HTTP 200 OK)
    return res.status(200).json({
      success: true,
      message: "ดึงข้อมูลสถิติสำเร็จ",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    // 3. กรณีเกิด Error (HTTP 500 Internal Server Error)
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getBookingList = async (req: Request, res: Response) => {
  try {
    const bookings = await getBookingListService();
    return res.status(200).json({
      success: true,
      message: "ดึงข้อมูลจองสำเร็จ",
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching booking list:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลจอง",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { getDashboardStats, getBookingList };
