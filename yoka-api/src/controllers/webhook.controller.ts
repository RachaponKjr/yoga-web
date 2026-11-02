import { Request, Response } from "express";
import prisma from "../config/prisma";
import { StatusCodes } from "http-status-codes";
import { mailService } from "../utils/mail";
import { generateBookingPDF } from "../utils/pdfGenerator";
import { getBookingSuccessTemplate } from "../templates/booking-success";
import { sendTelegramNotice } from "../utils/telegram.util";
import { ownerPurchaseEmail } from "../templates/purchase-notification";

export const omiseWebhookController = async (req: Request, res: Response) => {
  try {
    // Omise จะส่งข้อมูลมาใน body
    const event = req.body;

    if (event.key === "charge.complete" || event.key === "charge.create") {
      const charge = event.data;

      const orderId = charge?.metadata?.orderId;

      if (!orderId) {
        return res.status(StatusCodes.OK).send();
      }

      if (charge.status === "successful") {
        console.log(`Payment Successful for Order: ${orderId}`);

        // Omise may send charge.create, charge.complete, and retries for one payment.
        const transition = await prisma.booking.updateMany({
          where: { id: orderId, status: { not: "PAID" } },
          data: { status: "PAID", paidAt: new Date(), paymentId: charge.id },
        });
        if (transition.count === 0) return res.status(StatusCodes.OK).send("Already processed");

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

        const formatDate = (date: Date) => {
          return date.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Bangkok",
          });
        };

        const formatTime = (date: Date) => {
          return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Bangkok",
          });
        };

        const startDate = new Date(
          orderDetail.round?.startDateTime || new Date(),
        );
        const endDate = new Date(orderDetail.round?.endDateTime || new Date());

        let pdfBuffer: Buffer | undefined;
        try {
          pdfBuffer = await generateBookingPDF({
            customerName: `${orderDetail.student?.userInfo?.firstName || ""} ${orderDetail.student?.userInfo?.lastName || ""}`.trim(),
            courseTitle: orderDetail.round?.course?.title || "",
            roundDate: formatDate(startDate),
            roundTime: formatTime(startDate) + " - " + formatTime(endDate),
            bookingId: orderDetail.id,
          });
        } catch (error) {
          console.error("Booking PDF generation failed; sending email without attachment:", error);
        }

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

        const ownerEmail = process.env.BOOKING_NOTIFICATION_EMAIL || "Yogabyniti@gmail.com";
        const customerEmail = orderDetail.student?.email || orderDetail.email;
        const customerName = `${orderDetail.student?.userInfo?.firstName || ""} ${orderDetail.student?.userInfo?.lastName || ""}`.trim() || customerEmail || "Guest";
        const notice = {
          bookingId: orderDetail.id,
          customerName,
          customerEmail: customerEmail || "",
          courseTitle: orderDetail.round?.course?.title || "Yoga class",
          sessionDate: formatDate(startDate),
          sessionTime: formatTime(startDate) + " - " + formatTime(endDate),
          quantity: orderDetail.quantity,
          totalAmount: orderDetail.price,
        };
        const customerNotification = customerEmail
          ? mailService.sendEmail(
              customerEmail,
              `Booking confirmed: ${notice.courseTitle} | Yoga By Niti`,
              getBookingSuccessTemplate({
                customerName,
                courseTitle: notice.courseTitle,
                roundDate: notice.sessionDate,
                roundTime: notice.sessionTime,
                bookingId: notice.bookingId,
                quantity: notice.quantity,
                totalAmount: notice.totalAmount,
                contactEmail: ownerEmail,
              }),
              pdfBuffer
                ? [{ filename: `Booking-${orderDetail.id}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
                : undefined,
            )
          : Promise.resolve();

        const notifications = await Promise.allSettled([
          sendTelegramNotice(message),
          customerNotification,
          mailService.sendEmail(
            ownerEmail,
            `New booking: ${notice.courseTitle} (${notice.bookingId})`,
            ownerPurchaseEmail(notice),
          ),
        ]);
        notifications.forEach((result, index) => {
          if (result.status === "rejected") console.error(`Booking notification ${index} failed for ${orderId}:`, result.reason);
        });
      } else if (charge.status === "failed") {
        console.log(`Payment Failed for Order: ${orderId}`);

        await prisma.booking.updateMany({
          where: { id: orderId, status: { not: "PAID" } },
          data: {
            status: "CANCELLED",
            paymentId: charge.id,
          },
        });
      }
    }

    res.status(StatusCodes.OK).send("Webhook received");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};
