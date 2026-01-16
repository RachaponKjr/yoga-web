"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingController = exports.getBookingByUserIdController = exports.getBookingByIdController = exports.getAllBookingController = exports.createBookingController = void 0;
const sendResponse_1 = require("../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const order_type_1 = require("../types/order.type");
const booking_service_1 = require("../services/booking.service");
const mail_1 = require("../utils/mail");
const createBookingController = async (req, res) => {
    try {
        const user = req.user;
        const dataReq = { ...req.body, studentId: user.id };
        const payload = await order_type_1.BookingSchema.safeParseAsync(dataReq);
        if (!payload.success) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: payload.error.issues.map((issue) => issue.message).join(", "),
            });
            return;
        }
        const createBookingRes = await (0, booking_service_1.createBookingService)({
            payload: payload.data,
        });
        if (createBookingRes.status === 404) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: createBookingRes.message,
            });
            return;
        }
        else if (createBookingRes.status === 500) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: createBookingRes.message,
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Booking created successfully",
            data: createBookingRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.createBookingController = createBookingController;
const getAllBookingController = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
        const parsedOffset = Number(offset) >= 0 ? Number(offset) : 0;
        const getAllBookingRes = await (0, booking_service_1.getAllBookingService)({
            limit: parsedLimit,
            offset: parsedOffset,
        });
        if (!getAllBookingRes) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Booking not found!",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Booking fetched successfully",
            data: getAllBookingRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.getAllBookingController = getAllBookingController;
const getBookingByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const getBookingByIdRes = await (0, booking_service_1.getBookingByIdService)({ id });
        if (!getBookingByIdRes) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Booking not found!",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Booking fetched successfully",
            data: getBookingByIdRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.getBookingByIdController = getBookingByIdController;
const getBookingByUserIdController = async (req, res) => {
    try {
        const { id } = req.user;
        const getBookingByUserIdRes = await (0, booking_service_1.getBookingByUserIdService)({ id });
        if (!getBookingByUserIdRes) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Booking not found!",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Booking fetched successfully",
            data: getBookingByUserIdRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.getBookingByUserIdController = getBookingByUserIdController;
const updateBookingController = async (req, res) => {
    try {
        const { id } = req.params;
        const { payload } = req.body;
        const { status } = payload;
        console.log(req.user);
        if (!id) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "Booking ID is required!",
            });
            return;
        }
        if (!payload) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "Payload is required!",
            });
            return;
        }
        const updateBookingRes = await (0, booking_service_1.updateBookingService)({ id, payload });
        if (!updateBookingRes) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Booking not found!",
            });
            return;
        }
        if (status && status === "PAID" && updateBookingRes.student) {
            await mail_1.mailService.sendEmail(updateBookingRes.student.email, "Booking Payment Success", "Booking Payment Success");
        }
        else if (status && status === "CANCELLED" && updateBookingRes.student) {
            await mail_1.mailService.sendEmail(updateBookingRes.student.email, "Booking Cancellation Success", "Booking Cancellation Success");
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Booking updated successfully",
            data: updateBookingRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.updateBookingController = updateBookingController;
