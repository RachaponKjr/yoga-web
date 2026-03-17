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
    const { limit, offset } = req.query;

    const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
    const parsedOffset = Number(offset) >= 0 ? Number(offset) : 0;

    const getAllBookingRes = await getAllBookingService({
      limit: parsedLimit,
      offset: parsedOffset,
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
