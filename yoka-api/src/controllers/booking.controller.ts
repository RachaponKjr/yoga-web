import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { BookingSchema } from "../types/order.type";
import {
  createBookingService,
  getAllBookingService,
  getBookingByIdService,
  getBookingByUserIdService,
} from "../services/booking.service";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const createBookingController = async (
  req: AuthenticatedRequest,
  res: Response
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

    if (!createBookingRes) {
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
  res: Response
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
  res: Response
) => {
  try {
    const { id } = req.params;

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
  res: Response
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

export {
  createBookingController,
  getAllBookingController,
  getBookingByIdController,
  getBookingByUserIdController,
};
