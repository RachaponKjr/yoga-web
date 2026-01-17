import { BookingType } from "../types/order.type";
import prisma from "../config/prisma";
import { PaymentStatus } from "@prisma/client";

export interface PayloadProps {
  status?: string; // ส่งมาเป็น String (เช่น "PAID")
  price?: number; // แก้ราคา (เฉพาะใบจองนี้)
  description?: string; // แก้หมายเหตุ
  roundId?: string; // (Optional) ใส่มาเฉพาะกรณีอยากย้ายรอบเรียน (Reschedule)
}

const createBookingService = async ({ payload }: { payload: any }) => {
  const { quantity = 1, roundId } = payload; // สมมติว่าถ้าไม่ส่ง quantity มาคือ 1 คน

  return await prisma.$transaction(async (tx) => {
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
        message:
          "Class is full (คลาสเต็มแล้วครับ ไม่สามารถจองเกินจำนวนที่กำหนดได้)",
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
    });

    return {
      success: true,
      message: "Booking created successfully",
      status: 200,
      data: res,
    };
  });
};

const getAllBookingService = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) => {
  const res = await prisma.booking.findMany({
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

const getBookingByIdService = async ({ id }: { id: string }) => {
  const res = await prisma.booking.findUnique({
    where: { id },
    include: {
      round: true,
      student: true,
    },
  });

  return res;
};

const getBookingByUserIdService = async ({ id }: { id: string }) => {
  const res = await prisma.booking.findMany({
    where: { studentId: id },
    include: {
      round: {
        include: {
          course: { include: { teacher: { select: { userInfo: true } } } },
        },
      },
      // student: true,
    },
  });

  return res;
};

const updateBookingService = async ({
  id,
  payload,
}: {
  id: string;
  payload: PayloadProps;
}) => {
  console.log("Updating Booking ID:", id, "With Payload:", payload);

  const { roundId, price, description, status } = payload;

  // เตรียมข้อมูลสำหรับ Update Booking
  const updateData: any = {};

  if (price !== undefined) updateData.price = price;
  if (description !== undefined) updateData.description = description;

  // เช็ค Enum Status
  if (status) {
    // แปลง String เป็น Enum (ต้องระวังพิมพ์ผิด ต้องตรงกับ PaymentStatus)
    updateData.status = status as PaymentStatus;
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
  const res = await prisma.booking.update({
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

export {
  createBookingService,
  getAllBookingService,
  getBookingByIdService,
  getBookingByUserIdService,
  updateBookingService,
};
