"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingService = exports.getBookingByUserIdService = exports.getBookingByIdService = exports.getAllBookingService = exports.createBookingService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createBookingService = async ({ payload }) => {
    const { quantity = 1, roundId } = payload; // สมมติว่าถ้าไม่ส่ง quantity มาคือ 1 คน
    return await prisma_1.default.$transaction(async (tx) => {
        const round = await tx.courseRound.findUnique({
            where: { id: roundId },
        });
        if (!round) {
            return {
                success: false,
                message: "Course round not found",
                status: 404,
            };
        }
        if (round.current_online + quantity > round.max_online) {
            return {
                success: false,
                message: "Class is full (คลาสเต็มแล้วครับ ไม่สามารถจองเกินจำนวนที่กำหนดได้)",
                status: 500,
            };
        }
        await tx.courseRound.update({
            where: { id: roundId },
            data: {
                current_online: { increment: quantity },
            },
        });
        const res = await tx.booking.create({
            data: payload,
        });
        return {
            success: true,
            message: "Booking created successfully",
            status: 200,
            data: res,
        };
    });
};
exports.createBookingService = createBookingService;
const getAllBookingService = async ({ limit, offset, }) => {
    const res = await prisma_1.default.booking.findMany({
        include: {
            round: {
                include: {
                    course: true,
                },
            },
            student: {
                include: {
                    userInfo: true,
                },
            },
        },
        take: limit,
        skip: offset,
    });
    return res;
};
exports.getAllBookingService = getAllBookingService;
const getBookingByIdService = async ({ id }) => {
    const res = await prisma_1.default.booking.findUnique({
        where: { id },
        include: {
            round: true,
            student: true,
        },
    });
    return res;
};
exports.getBookingByIdService = getBookingByIdService;
const getBookingByUserIdService = async ({ id }) => {
    const res = await prisma_1.default.booking.findMany({
        where: { studentId: id },
        include: {
            round: true,
            student: true,
        },
    });
    return res;
};
exports.getBookingByUserIdService = getBookingByUserIdService;
const updateBookingService = async ({ id, payload, }) => {
    console.log("Updating Booking ID:", id, "With Payload:", payload);
    const { roundId, price, description, status } = payload;
    // เตรียมข้อมูลสำหรับ Update Booking
    const updateData = {};
    if (price !== undefined)
        updateData.price = price;
    if (description !== undefined)
        updateData.description = description;
    // เช็ค Enum Status
    if (status) {
        // แปลง String เป็น Enum (ต้องระวังพิมพ์ผิด ต้องตรงกับ PaymentStatus)
        updateData.status = status;
    }
    // **สำคัญ**: ถ้ามีการส่ง roundId มา (ย้ายรอบ)
    // Booking นี้จะย้ายไปเกาะรอบใหม่ แต่ข้อมูลรอบเดิม (ครู/คอร์ส) จะไม่ถูกแก้ไข
    if (roundId) {
        updateData.round = {
            connect: { id: roundId },
        };
    }
    // 2. สั่ง Update แค่ตาราง Booking เท่านั้น
    // (ผมลบส่วน prisma.courseRound.update ทิ้งไปแล้ว ตามที่คุณต้องการ)
    const res = await prisma_1.default.booking.update({
        where: { id },
        data: updateData,
        include: {
            // ดึงข้อมูลรอบเรียนมาแสดงผลเฉยๆ (Read-only)
            round: {
                include: {
                    course: true,
                    teacher: true,
                },
            },
            student: true,
        },
    });
    return res;
};
exports.updateBookingService = updateBookingService;
