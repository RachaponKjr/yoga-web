import { Request, Response } from "express";
import {
  getBookingListService,
  getMonitorCountryStatsService,
  getStatsService,
  updateUserService,
} from "../services/admin.service";

export interface UserEditState {
  firstName: string;
  lastName: string;
  sex: string;
  phone_number: string;
  country: string;
  facebook: string;
  instagram: string;
  twitter: string;
  role: string;
  experience: string;
}

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

const updateProfileController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const {
      firstName,
      lastName,
      sex,
      phone_number,
      country,
      facebook,
      instagram,
      twitter,
      role,
      experience,
    } = req.body as UserEditState;

    const profile = {
      firstName,
      lastName,
      sex,
      phone_number,
      country,
      facebook,
      instagram,
      twitter,
      role,
      experience,
    };

    const updatedUser = await updateUserService(id, profile);

    return res.status(200).json({
      success: true,
      message: "Update user profile successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getMonitorCountryStats = async (req: Request, res: Response) => {
  try {
    const stats = await getMonitorCountryStatsService();
    return res.status(200).json({
      success: true,
      message: "ดึงข้อมูลสถิติสำเร็จ",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching monitor country stats:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export {
  getDashboardStats,
  getBookingList,
  updateProfileController,
  getMonitorCountryStats,
};
