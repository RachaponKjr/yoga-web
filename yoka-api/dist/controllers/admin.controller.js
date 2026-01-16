"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileController = exports.getBookingList = exports.getDashboardStats = void 0;
const admin_service_1 = require("../services/admin.service");
const getDashboardStats = async (req, res) => {
    try {
        // 1. เรียก Service เพื่อดึงข้อมูล
        const stats = await (0, admin_service_1.getStatsService)();
        // 2. ส่งข้อมูลกลับไป (HTTP 200 OK)
        return res.status(200).json({
            success: true,
            message: "ดึงข้อมูลสถิติสำเร็จ",
            data: stats,
        });
    }
    catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // 3. กรณีเกิด Error (HTTP 500 Internal Server Error)
        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getDashboardStats = getDashboardStats;
const getBookingList = async (req, res) => {
    try {
        const bookings = await (0, admin_service_1.getBookingListService)();
        return res.status(200).json({
            success: true,
            message: "ดึงข้อมูลจองสำเร็จ",
            data: bookings,
        });
    }
    catch (error) {
        console.error("Error fetching booking list:", error);
        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการดึงข้อมูลจอง",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getBookingList = getBookingList;
const updateProfileController = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, sex, phone_number, country, facebook, instagram, twitter, role, experience, } = req.body;
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
        const updatedUser = await (0, admin_service_1.updateUserService)(id, profile);
        return res.status(200).json({
            success: true,
            message: "Update user profile successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user profile",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateProfileController = updateProfileController;
