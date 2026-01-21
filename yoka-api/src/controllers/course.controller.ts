import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import {
  CourseRoundSchema,
  CourseRoundType,
  CourseYogaSchema,
} from "../types/course.type";
import {
  createCourseRoundService,
  createCourseService,
  deleteCourseService,
  getCourseActiveService,
  getCourseByIdService,
  getCourseRoundByCourseIdService,
  getCourseRoundByIdService,
  getCourseRoundService,
  getCourseRoundTodayOrMonthService,
  getCourseService,
  getMyCourseService,
  getMyRoundService,
} from "../services/course.service";
import { StatusCodes } from "http-status-codes";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const createCourseController = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coursePoster = files["course_poster"]?.[0];
    const courseImages = files["image_course"] || [];
    const payload = {
      ...req.body,
      cover_image: coursePoster?.path,
      images: courseImages.map((image) => image.path),
    };
    payload.price = Number(payload.price);
    payload.discount_price = Number(payload.discount_price);
    const validateCourse = CourseYogaSchema.safeParse(payload);
    if (!validateCourse.success) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: validateCourse.error.issues
          .map((issue) => issue.message)
          .join(", "),
      });
      return;
    }
    const result = await createCourseService({ payload });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Course created successfully!",
      data: result,
    });
    return;
  } catch (error: Error | unknown) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
    return;
  }
};

const createCourseRoundController = async (req: Request, res: Response) => {
  try {
    const payload = CourseRoundSchema.safeParse(req.body);
    if (!payload.success) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: payload.error.issues.map((issue) => issue.message).join(", "),
      });
      return;
    }

    const result = await createCourseRoundService({ payload: payload.data });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Course round created successfully!",
      data: result,
    });
    return;
  } catch (error: Error | unknown) {
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
    return;
  }
};

const getMyCourseController = async (req: Request, res: Response) => {
  try {
    const { limit, offset, search } = req.query;
    const { userId } = req.params as { userId: string };

    const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
    const parsedOffset = Number(offset) >= 0 ? Number(offset) : 0;
    const searchTerm = typeof search === "string" ? search : undefined;

    const { courses, total } = await getMyCourseService({
      limit: parsedLimit,
      offset: parsedOffset,
      search: searchTerm,
      userId,
    });

    if (!courses || courses.length === 0) {
    }

    const totalPages = Math.ceil(total / parsedLimit);
    const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
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
  } catch (error: Error | unknown) {
    console.error("Get Course Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getCourseController = async (req: Request, res: Response) => {
  try {
    const { limit, offset, search } = req.query;

    const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
    const parsedOffset = Number(offset) >= 0 ? Number(offset) : 0;
    const searchTerm = typeof search === "string" ? search : undefined;

    const { courses, total } = await getCourseService({
      limit: parsedLimit,
      offset: parsedOffset,
      search: searchTerm,
    });

    if (!courses || courses.length === 0) {
    }

    const totalPages = Math.ceil(total / parsedLimit);
    const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
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
  } catch (error: Error | unknown) {
    console.error("Get Course Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getCourseByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const course = await getCourseByIdService({ id: id as string });

    if (!course) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Course not found",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Course fetched successfully",
      data: course,
    });
    return;
  } catch (error: Error | unknown) {
    console.error("Get Course Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getCourseActiveController = async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;

    const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
    const parsedOffset = Number(offset) >= 0 ? Number(offset) : 0;

    const { courses, total } = await getCourseActiveService({
      limit: parsedLimit,
      offset: parsedOffset,
    });

    if (!courses || courses.length === 0) {
    }

    const totalPages = Math.ceil(total / parsedLimit);
    const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
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
  } catch (error: Error | unknown) {
    console.error("Get Course Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getCourseRoundController = async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;

    const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
    const parsedOffset = Number(offset) >= 0 ? Number(offset) : 0;

    const { courses, total } = await getCourseRoundService({
      limit: parsedLimit,
      offset: parsedOffset,
    });

    if (!courses || courses.length === 0) {
    }

    const totalPages = Math.ceil(total / parsedLimit);
    const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
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
  } catch (error: Error | unknown) {
    console.error("Get Course Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getCourseRoundByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const courseRound = await getCourseRoundByIdService({ id: id });

    if (!courseRound) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Course round not found",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Course round fetched successfully",
      data: courseRound,
    });
  } catch (error: Error | unknown) {
    console.error("Get Course Round Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getCourseRoundByCourseIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params as { id: string };

    const courseRound = await getCourseRoundByCourseIdService({ id: id });

    if (!courseRound) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Course round not found",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Course round fetched successfully",
      data: courseRound,
    });
  } catch (error: Error | unknown) {
    console.error("Get Course Round Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getCourseRoundTodayOrMonthController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { today, month } = req.query;
    const courseRound = await getCourseRoundTodayOrMonthService({
      today: today as string,
      month: month as string,
    });

    if (!courseRound) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Course round not found",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Course round fetched successfully",
      data: courseRound,
    });
  } catch (error: Error | unknown) {
    console.error("Get Course Round Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const deleteCourseController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params as { id: string };
    const user = req.user;

    const course = await deleteCourseService({ id, userId: user?.id });

    if (!course) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Course not found",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Course deleted successfully",
      data: course,
    });
    return;
  } catch (error: Error | unknown) {
    console.error("Delete Course Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getMyRoundController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user = req.user;

    const courseRound = await getMyRoundService({ userId: user?.id });

    if (!courseRound) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Course round not found",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Course round fetched successfully",
      data: courseRound,
    });
    return;
  } catch (error: Error | unknown) {
    console.error("Get Course Round Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export {
  createCourseController,
  getCourseController,
  createCourseRoundController,
  getCourseRoundController,
  getCourseRoundByIdController,
  getCourseByIdController,
  getCourseRoundByCourseIdController,
  getCourseRoundTodayOrMonthController,
  getMyCourseController,
  deleteCourseController,
  getMyRoundController,
  getCourseActiveController,
};
