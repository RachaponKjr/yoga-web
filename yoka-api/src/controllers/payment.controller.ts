import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createCardChargeService } from "../services/payment.service";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export const chargeCardController = async (req: Request, res: Response) => {
  try {
    // Frontend ต้องส่ง 2 ค่านี้มา
    const { orderId, omiseToken } = req.body;
    console.log(req.body, "orderId, omiseToken");
    if (!omiseToken) {
      throw new AppError("Omise Token is required", StatusCodes.BAD_REQUEST);
    }

    // 1. ดึงข้อมูล Order เพื่อเอายอดเงินจริง (ห้ามเชื่อยอดเงินจาก Frontend)
    const order = await prisma.booking.findUnique({
      where: { id: orderId },
      include: { student: true }, // ดึง email user มาด้วย (ถ้ามี)
    });

    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND);
    }

    // 2. สั่งตัดบัตร
    const charge = await createCardChargeService({
      amount: order.price,
      token: omiseToken,
      orderId: order.id,
      email: order.student?.email,
    });

    // 3. เช็คผลลัพธ์เพื่อบอก Frontend ว่าต้อง Redirect ไปหน้า OTP ไหม?
    // ถ้า charge.status เป็น 'pending' และมี authorize_uri แปลว่าติด 3D Secure (ต้องใส่ OTP)
    const is3DSecure = charge.status === "pending" && charge.authorize_uri;

    res.status(StatusCodes.OK).json({
      success: true,
      message: is3DSecure
        ? "Please proceed to 3D Secure"
        : "Payment successful",
      data: {
        chargeId: charge.id,
        status: charge.status,
        authorizeUri: charge.authorize_uri, // Frontend ต้อง redirect user ไปที่นี่ถ้ามีค่า
      },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
