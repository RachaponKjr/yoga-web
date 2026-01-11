import omise from "../config/omise"; // config เดิม
import { AppError } from "../utils/AppError";
import { StatusCodes } from "http-status-codes";

interface CreateCardChargeParams {
  amount: number; // บาท
  token: string; // Token ที่ขึ้นต้นด้วย "tokn_..." (รับจาก Frontend)
  orderId: string; // เอาไว้ track
  email?: string; // (Optional) อีเมลลูกค้า
  couponId?: string; // (Optional) รหัสคูปอง
}

export const createCardChargeService = async ({
  amount,
  token,
  orderId,
  couponId,
  email,
}: CreateCardChargeParams) => {
  try {
    const charge = await omise.charges.create({
      amount: Math.round(amount * 100), // แปลงบาทเป็นสตางค์
      currency: "thb",
      card: token, // ⭐ หัวใจสำคัญ: ส่ง Token แทนเลขบัตร
      description: `Order ID: ${orderId}`,
      metadata: {
        orderId: orderId,
        email: email,
        discountAmount: amount,
        couponId: couponId,
      },
      // 3D Secure: ต้องระบุ return_uri เพื่อให้ธนาคารเด้งกลับมาหาเราหลังใส่ OTP
      return_uri: `${process.env.REDIRECT_URL}/payment/complete?orderId=${orderId}`,
    });

    return charge;
  } catch (error: any) {
    throw new AppError(
      `Omise Card Error: ${error.message}`,
      StatusCodes.BAD_REQUEST
    );
  }
};
