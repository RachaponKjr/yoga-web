import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createCardChargeService } from "../services/payment.service";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export const chargeCardController = async (req: Request, res: Response) => {
  try {
    // Frontend ต้องส่ง 2 ค่านี้มา
    const { orderId, omiseToken, couponId } = req.body;
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
      couponId: couponId,
      amount: order.price,
      token: omiseToken,
      orderId: order.id,
      email: order.student?.email,
    });

    const is3DSecure = charge.status === "pending" && charge.authorize_uri;

    if (couponId) {
      try {
        await prisma.$transaction(async (tx) => {
          // 3.1 Update จำนวนการใช้คูปอง
          const updatedCoupon = await tx.coupon.update({
            where: { id: couponId },
            data: {
              currentUses: {
                increment: 1,
              },
            },
          });

          // 3.2 เช็คว่าเกิน Limit หรือไม่ (หลังจากบวกไปแล้ว)
          if (
            updatedCoupon.usageLimit !== null &&
            updatedCoupon.currentUses > updatedCoupon.usageLimit
          ) {
            // ถ้าเกิน Limit ให้ throw error เพื่อ rollback transaction
            throw new Error("Coupon usage limit exceeded");
          }

          // 3.3 บันทึก History การใช้
          // ⚠️ Warning: discount ไม่ควรเท่ากับ order.price (ราคาเต็ม)
          // ปกติควรต้องคำนวณว่าคูปองนี้ลดไปกี่บาท
          await tx.couponUsage.create({
            data: {
              discount: 0, // 👈 TODO: ต้องแก้ logic คำนวณส่วนลดจริงตรงนี้
              usedAt: new Date(),
              orderId: orderId,
              couponId: couponId,
              userId: order.student?.id || "",
            },
          });
        });
      } catch (couponError) {
        // ⚠️ Critical: เงินถูกตัดไปแล้วแต่บันทึกคูปองไม่สำเร็จ
        // คุณต้องเลือกว่าจะ:
        // A. ปล่อยผ่าน (Log error ไว้ แล้วให้ User ได้ของไปเลย) -> แนะนำอันนี้เพื่อ UX ไม่พัง
        // B. Refund เงินคืน (ซับซ้อน)
        console.error("Payment success but Coupon update failed:", couponError);
        // ไม่ throw error ต่อ เพื่อให้ return response success ไปหา User ได้
      }
    }

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
