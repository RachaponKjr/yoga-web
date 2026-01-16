"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRoundController = exports.deleteCourseController = exports.getMyCourseController = exports.getCourseRoundTodayOrMonthController = exports.getCourseRoundByCourseIdController = exports.getCourseByIdController = exports.getCourseRoundByIdController = exports.getCourseRoundController = exports.createCourseRoundController = exports.getCourseController = exports.createCourseController = void 0;
const sendResponse_1 = require("../utils/sendResponse");
const course_type_1 = require("../types/course.type");
const course_service_1 = require("../services/course.service");
const http_status_codes_1 = require("http-status-codes");
const createCourseController = async (req, res) => {
    try {
        const files = req.files;
        const coursePoster = files["course_poster"]?.[0];
        const courseImages = files["image_course"] || [];
        const payload = {
            ...req.body,
            cover_image: coursePoster?.path,
            images: courseImages.map((image) => image.path),
        };
        payload.price = Number(payload.price);
        payload.discount_price = Number(payload.discount_price);
        const validateCourse = course_type_1.CourseYogaSchema.safeParse(payload);
        if (!validateCourse.success) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: validateCourse.error.issues
                    .map((issue) => issue.message)
                    .join(", "),
            });
            return;
        }
        const result = await (0, course_service_1.createCourseService)({ payload });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Course created successfully!",
            data: result,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
        return;
    }
};
exports.createCourseController = createCourseController;
const createCourseRoundController = async (req, res) => {
    try {
        const payload = course_type_1.CourseRoundSchema.safeParse(req.body);
        if (!payload.success) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: payload.error.issues.map((issue) => issue.message).join(", "),
            });
            return;
        }
        const result = await (0, course_service_1.createCourseRoundService)({ payload: payload.data });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Course round created successfully!",
            data: result,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
        return;
    }
};
exports.createCourseRoundController = createCourseRoundController;
const getMyCourseController = async (req, res) => {
    try {
        const { limit, offset, search } = req.query;
        const { userId } = req.params;
        const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
        const parsedOffset = Number(offset) >= 0 ? Number(offset) : 0;
        const searchTerm = typeof search === "string" ? search : undefined;
        const { courses, total } = await (0, course_service_1.getMyCourseService)({
            limit: parsedLimit,
            offset: parsedOffset,
            search: searchTerm,
            userId,
        });
        if (!courses || courses.length === 0) {
        }
        const totalPages = Math.ceil(total / parsedLimit);
        const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Courses fetched successfully",
            data: {
                courses,
                pagination: {
                    totalItems: total,
                    totalPages,
                    currentPage,
                    itemsPerPage: parsedLimit,
                    hasNextPage: parsedOffset + parsedLimit < total,
                    hasPrevPage: parsedOffset > 0,
                },
            },
        });
        return;
    }
    catch (error) {
        console.error("Get Course Error:", error); // Log ไว้ดูใน Server
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.getMyCourseController = getMyCourseController;
const getCourseController = async (req, res) => {
    try {
        const { limit, offset, search } = req.query;
        const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
        const parsedOffset = Number(offset) >= 0 ? Number(offset) : 0;
        const searchTerm = typeof search === "string" ? search : undefined;
        const { courses, total } = await (0, course_service_1.getCourseService)({
            limit: parsedLimit,
            offset: parsedOffset,
            search: searchTerm,
        });
        if (!courses || courses.length === 0) {
        }
        const totalPages = Math.ceil(total / parsedLimit);
        const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Courses fetched successfully",
            data: {
                courses,
                pagination: {
                    totalItems: total,
                    totalPages,
                    currentPage,
                    itemsPerPage: parsedLimit,
                    hasNextPage: parsedOffset + parsedLimit < total,
                    hasPrevPage: parsedOffset > 0,
                },
            },
        });
    }
    catch (error) {
        console.error("Get Course Error:", error); // Log ไว้ดูใน Server
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.getCourseController = getCourseController;
const getCourseByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await (0, course_service_1.getCourseByIdService)({ id });
        if (!course) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Course not found",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Course fetched successfully",
            data: course,
        });
        return;
    }
    catch (error) {
        console.error("Get Course Error:", error); // Log ไว้ดูใน Server
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.getCourseByIdController = getCourseByIdController;
const getCourseRoundController = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
        const parsedOffset = Number(offset) >= 0 ? Number(offset) : 0;
        const { courses, total } = await (0, course_service_1.getCourseRoundService)({
            limit: parsedLimit,
            offset: parsedOffset,
        });
        if (!courses || courses.length === 0) {
        }
        const totalPages = Math.ceil(total / parsedLimit);
        const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Courses fetched successfully",
            data: {
                courses,
                pagination: {
                    totalItems: total,
                    totalPages,
                    currentPage,
                    itemsPerPage: parsedLimit,
                    hasNextPage: parsedOffset + parsedLimit < total,
                    hasPrevPage: parsedOffset > 0,
                },
            },
        });
    }
    catch (error) {
        console.error("Get Course Error:", error); // Log ไว้ดูใน Server
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.getCourseRoundController = getCourseRoundController;
const getCourseRoundByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const courseRound = await (0, course_service_1.getCourseRoundByIdService)({ id });
        if (!courseRound) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Course round not found",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Course round fetched successfully",
            data: courseRound,
        });
    }
    catch (error) {
        console.error("Get Course Round Error:", error); // Log ไว้ดูใน Server
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.getCourseRoundByIdController = getCourseRoundByIdController;
const getCourseRoundByCourseIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const courseRound = await (0, course_service_1.getCourseRoundByCourseIdService)({ id });
        if (!courseRound) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Course round not found",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Course round fetched successfully",
            data: courseRound,
        });
    }
    catch (error) {
        console.error("Get Course Round Error:", error); // Log ไว้ดูใน Server
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.getCourseRoundByCourseIdController = getCourseRoundByCourseIdController;
const getCourseRoundTodayOrMonthController = async (req, res) => {
    try {
        const { today, month } = req.query;
        const courseRound = await (0, course_service_1.getCourseRoundTodayOrMonthService)({
            today: today,
            month: month,
        });
        if (!courseRound) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Course round not found",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Course round fetched successfully",
            data: courseRound,
        });
    }
    catch (error) {
        console.error("Get Course Round Error:", error); // Log ไว้ดูใน Server
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.getCourseRoundTodayOrMonthController = getCourseRoundTodayOrMonthController;
const deleteCourseController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const course = await (0, course_service_1.deleteCourseService)({ id, userId: user?.id });
        if (!course) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Course not found",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Course deleted successfully",
            data: course,
        });
        return;
    }
    catch (error) {
        console.error("Delete Course Error:", error); // Log ไว้ดูใน Server
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.deleteCourseController = deleteCourseController;
const getMyRoundController = async (req, res) => {
    try {
        const user = req.user;
        const courseRound = await (0, course_service_1.getMyRoundService)({ userId: user?.id });
        if (!courseRound) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Course round not found",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "Course round fetched successfully",
            data: courseRound,
        });
        return;
    }
    catch (error) {
        console.error("Get Course Round Error:", error); // Log ไว้ดูใน Server
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.getMyRoundController = getMyRoundController;
