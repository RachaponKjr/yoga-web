import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { BookingSchema } from "../types/order.type";
import {
  checkStatusService,
  createBookingService,
  getAllBookingService,
  getBookingByIdService,
  getBookingByUserIdService,
  updateBookingService,
} from "../services/booking.service";
import { mailService } from "../utils/mail";
import { sendTelegramNotice } from "../utils/telegram.util";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const createBookingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user = req.user;
    const dataReq = { ...req.body, studentId: user.id };
    const payload = await BookingSchema.safeParseAsync(dataReq);
    if (!payload.success) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: payload.error.issues.map((issue) => issue.message).join(", "),
      });
      return;
    }

    const createBookingRes = await createBookingService({
      payload: payload.data,
    });

    if (createBookingRes.data.type === "WALK_IN") {
      const formatDate = (date: Date) => {
        return date.toLocaleDateString("th-TH", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      };
      const formatTime = (date: Date) => {
        return date.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // เป็น AM/PM
        });
      };
      const message = `
<b>🔔 มีรายการจองใหม่! (Walk-in) (ทดสอบการจองไม่ได้จองจริง)</b>
<b>วันที่จอง:</b> ${formatDate(new Date())}
<b>เวลา:</b> ${formatTime(new Date())}
--------------------------
<b>รหัสการจอง:</b> <code>${createBookingRes.data.id}</code>
<b>ผู้จอง:</b> "Admin YogaByniti"
<b>คอร์ส:</b> ${createBookingRes.data.round?.course?.title}
<b>ยอดเงิน:</b> ฿${createBookingRes.data.price.toLocaleString()}
<b>สถานะ:</b> ${createBookingRes.data.status === "PAID" ? "ชำระเงินแล้ว" : "รอชำระเงิน"}
<b>สถานะการจอง:</b> ${createBookingRes.data.type === "WALK_IN" ? "จองที่สตูดิโอ" : "จองออนไลน์"}
<b>หมายเหตุ:</b> ${createBookingRes.data.note}
--------------------------
<a href="https://admin.yogabyniti.com/bookings">ดูรายละเอียดในระบบ Admin</a>
    `;
      sendTelegramNotice(message);
    }

    if (createBookingRes.status === 404) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: createBookingRes.message,
      });
      return;
    } else if (createBookingRes.status === 500) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: createBookingRes.message,
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Booking created successfully",
      data: createBookingRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

const getAllBookingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { page, limit } = req.query;

    const parsedPage = Number(page) > 0 ? Number(page) : 1;
    const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;

    const calculatedOffset = (parsedPage - 1) * parsedLimit;

    const getAllBookingRes = await getAllBookingService({
      limit: parsedLimit,
      offset: calculatedOffset, // ส่งค่าที่คำนวณแล้วไปให้ Service
    });
    if (!getAllBookingRes) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Booking not found!",
      });
      return;
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Booking fetched successfully",
      data: getAllBookingRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

const getBookingByIdController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params as { id: string };

    const getBookingByIdRes = await getBookingByIdService({ id });
    if (!getBookingByIdRes) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Booking not found!",
      });
      return;
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Booking fetched successfully",
      data: getBookingByIdRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

const getBookingByUserIdController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.user;

    const getBookingByUserIdRes = await getBookingByUserIdService({ id });
    if (!getBookingByUserIdRes) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Booking not found!",
      });
      return;
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Booking fetched successfully",
      data: getBookingByUserIdRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

const updateBookingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params as { id: string };
    const { payload } = req.body;
    const { status } = payload;

    if (!id) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Booking ID is required!",
      });
      return;
    }
    if (!payload) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Payload is required!",
      });
      return;
    }
    const updateBookingRes = await updateBookingService({ id, payload });
    if (!updateBookingRes) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Booking not found!",
      });
      return;
    }

    if (status && status === "PAID" && updateBookingRes.student) {
      await mailService.sendEmail(
        updateBookingRes.student.email,
        "Booking Payment Success",
        "Booking Payment Success",
      );
    } else if (status && status === "CANCELLED" && updateBookingRes.student) {
      await mailService.sendEmail(
        updateBookingRes.student.email,
        "Booking Cancellation Success",
        "Booking Cancellation Success",
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Booking updated successfully",
      data: updateBookingRes,
    });
    return;
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

const checkStatusController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { bookingId } = req.query as { bookingId: string };

    if (!bookingId) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Booking ID is required!",
      });
      return;
    }

    const checkStatusRes = await checkStatusService({ bookingId });
    if (!checkStatusRes) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Booking not found!",
      });
      return;
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Booking status checked successfully",
      data: checkStatusRes,
    });
    return;
  } catch (err) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server error!",
    });
    return;
  }
};

export {
  createBookingController,
  getAllBookingController,
  getBookingByIdController,
  getBookingByUserIdController,
  updateBookingController,
  checkStatusController,
};
