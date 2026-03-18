import { Request, Response } from "express";
import prisma from "../config/prisma";
import { StatusCodes } from "http-status-codes";
import { mailService } from "../utils/mail";
import { generateBookingPDF } from "../utils/pdfGenerator";
import { getBookingSuccessTemplate } from "../templates/booking-success";
import { sendTelegramNotice } from "../utils/telegram.util";

export const omiseWebhookController = async (req: Request, res: Response) => {
  try {
    // Omise จะส่งข้อมูลมาใน body
    const event = req.body;
    console.log(event, "EVENT");
    console.log("Webhook Received:", event.key);

    if (event.key === "charge.complete" || event.key === "charge.create") {
      const charge = event.data;

      const orderId = charge.metadata.orderId;

      if (!orderId) {
        return res.status(StatusCodes.OK).send();
      }

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
        const orderDetail = await prisma.booking.findUnique({
          where: { id: orderId },
          include: {
            round: {
              include: {
                course: true,
              },
            },
            student: {
              select: {
                email: true,
                userInfo: {
                  select: {
                    phone_number: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        });

        if (!orderDetail) {
          return res.status(StatusCodes.OK).send();
        }

        const userDetail = {
          email: orderDetail.student?.email || "",
          phone_number: orderDetail.student?.userInfo?.phone_number || "",
          firstName: orderDetail.student?.userInfo?.firstName || "",
          lastName: orderDetail.student?.userInfo?.lastName || "",
        };

        const bookingDetail = {
          bookingId: orderDetail.id,
          courseTitle: orderDetail.round?.course?.title || "",
          startDate: orderDetail.round?.startDateTime || "",
          endDate: orderDetail.round?.endDateTime || "",
          totalAmount: orderDetail.price,
        };

        const formatDate = (date: Date) => {
          return date.toLocaleDateString("en-US", {
            // หรือ th-TH ถ้าอยากได้ภาษาไทย
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        };

        const formatTime = (date: Date) => {
          return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // เป็น AM/PM
          });
        };

        // ... ตอนเรียกใช้ ...

        const startDate = new Date(
          orderDetail.round?.startDateTime || new Date(),
        );
        const endDate = new Date(orderDetail.round?.endDateTime || new Date());

        const pdfBuffer = await generateBookingPDF({
          customerName: `${orderDetail.student?.userInfo?.firstName} ${orderDetail.student?.userInfo?.lastName}`,
          courseTitle: orderDetail.round?.course?.title || "",
          roundDate: formatDate(startDate),
          roundTime: formatTime(startDate) + " - " + formatTime(endDate),
          bookingId: orderDetail.id,
        });

        const message = `
<b>🔔 มีรายการจองใหม่!</b>
<b>วันที่จอง:</b> ${formatDate(new Date())}
<b>เวลา:</b> ${formatTime(new Date())}
--------------------------
<b>รหัสการจอง:</b> <code>${orderDetail.id}</code>
<b>ลูกค้า:</b> ${orderDetail.student?.email}
<b>คอร์ส:</b> ${orderDetail.round?.course?.title}
<b>ยอดเงิน:</b> ฿${orderDetail.price.toLocaleString()}
<b>สถานะ:</b> ${orderDetail.status}
--------------------------
<a href="https://admin.yogabyniti.com/bookings">ดูรายละเอียดในระบบ Admin</a>
    `;

        await sendTelegramNotice(message);

        await mailService.sendEmail(
          orderDetail.student?.email || "",
          "Thank you for booking with Yoka by Niti!",
          await getBookingSuccessTemplate({
            customerName: `${orderDetail.student?.userInfo?.firstName} ${orderDetail.student?.userInfo?.lastName}`,
            courseTitle: orderDetail.round?.course?.title || "",
            roundDate: formatDate(startDate),
            roundTime: formatTime(startDate) + " - " + formatTime(endDate),
            bookingId: orderDetail.id,
          }),
          [
            {
              filename: `Booking-${orderDetail.id}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        );
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
