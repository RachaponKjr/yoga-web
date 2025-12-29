import { Request, Response } from "express";
import prisma from "../config/prisma";
import { StatusCodes } from "http-status-codes";

export const omiseWebhookController = async (req: Request, res: Response) => {
  try {
    // Omise จะส่งข้อมูลมาใน body
    const event = req.body;

    console.log("Webhook Received:", event.key); // Log ดู event ที่เข้ามา

    // เราสนใจแค่ event ที่ชื่อว่า "charge.complete" (การจ่ายเงินสิ้นสุดลง)
    if (event.key === "charge.complete") {
      const charge = event.data;

      // เช็ค metadata ที่เราแอบฝากไว้ตอน createCharge (orderId)
      const orderId = charge.metadata.orderId;

      if (!orderId) {
        // กรณีไม่มี Order ID แนบมา (ไม่น่าเกิดขึ้นถ้าเราเขียนถูก)
        return res.status(StatusCodes.OK).send();
      }

      // ตรวจสอบสถานะการจ่ายเงิน
      if (charge.status === "successful") {
        console.log(`Payment Successful for Order: ${orderId}`);

        // ✅ อัปเดต Database ว่าจ่ายเงินแล้ว
        await prisma.booking.update({
          where: { id: orderId },
          data: {
            status: "PAID", // สถานะ Order
            paidAt: new Date(), // เวลาที่จ่าย
            // อาจจะเก็บ chargeId ไว้อ้างอิงด้วยก็ได้
            paymentId: charge.id,
          },
        });
      } else if (charge.status === "failed") {
        console.log(`Payment Failed for Order: ${orderId}`);

        // ❌ อัปเดต Database ว่าจ่ายไม่สำเร็จ (ถ้าต้องการ)
        await prisma.booking.update({
          where: { id: orderId },
          data: {
            status: "CANCELLED",
            paymentId: charge.id,
          },
        });
      }
    }

    // ⭐ สำคัญมาก: ต้องตอบกลับ 200 OK เสมอ
    // ไม่งั้น Omise จะคิดว่าเราไม่ได้รับ และจะส่งซ้ำมาเรื่อยๆ
    res.status(StatusCodes.OK).send("Webhook received");
  } catch (error) {
    console.error("Webhook Error:", error);
    // ต่อให้ Error ก็ควรตอบ 200 หรือ 500 ตามความเหมาะสม
    // แต่ปกติถ้า Code พัง เราตอบ 500 เดี๋ยว Omise ส่งใหม่ให้
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};
