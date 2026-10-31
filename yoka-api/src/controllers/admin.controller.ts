import z from "zod";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
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

    const safeStats = JSON.parse(
      JSON.stringify(stats, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
    // 2. ส่งข้อมูลกลับไป (HTTP 200 OK)
    return res.status(200).json({
      success: true,
      message: "ดึงข้อมูลสถิติสำเร็จ",
      data: safeStats,
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


const instructorInput = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(72),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone_number: z.string().trim().max(30).default(""),
  experience: z.string().trim().max(5000).default(""),
});
const instructorSelect = {
  id: true, email: true, role: true, createdAt: true, userInfo: true,
} as const;

export const listInstructors = async (_req: Request, res: Response) => {
  try {
    const data = await prisma.user.findMany({
      where: { role: "Instructor" }, select: instructorSelect,
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data });
  } catch {
    return res.status(500).json({ success: false, message: "โหลดข้อมูลครูผู้สอนไม่สำเร็จ" });
  }
};

export const createInstructor = async (req: Request, res: Response) => {
  const parsed = instructorInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({
    success: false, message: "กรุณากรอกชื่อ นามสกุล อีเมล และรหัสผ่านอย่างน้อย 6 ตัวอักษรให้ครบถ้วน",
  });
  try {
    const { email, password, ...profile } = parsed.data;
    const data = await prisma.user.create({
      data: {
        email, password: await bcrypt.hash(password, 10), role: "Instructor",
        userInfo: { create: profile },
      },
      select: instructorSelect,
    });
    return res.status(201).json({ success: true, data });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return res.status(409).json({ success: false, message: "อีเมลนี้มีบัญชีอยู่แล้ว กรุณาใช้อีเมลอื่น" });
    }
    return res.status(500).json({ success: false, message: "สร้างครูผู้สอนไม่สำเร็จ กรุณาลองใหม่" });
  }
};
