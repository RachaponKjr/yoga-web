import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import {
  CourseRoundSchema,
  CourseRoundType,
  CourseYogaSchema,
} from "../types/course.type";
import {
  adminDeleteCourseService,
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
  updateCourseService,
  updateCourseStatusService,
} from "../services/course.service";
import { StatusCodes } from "http-status-codes";

interface AuthenticatedRequest extends Request {
  user?: any;
}

type FileDict = { [fieldname: string]: Express.Multer.File[] };

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

const adminDeleteCourseController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params as { id: string };

    const course = await adminDeleteCourseService({ id });

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

const updateCourseStatusController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params as { id: string };

    const course = await updateCourseStatusService({
      id,
      isShow: req.body.isShow,
    });

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
      message: "Course status updated successfully",
      data: course,
    });
    return;
  } catch (error: Error | unknown) {
    console.error("Update Course Status Error:", error); // Log ไว้ดูใน Server
    sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updateCourseController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params as { id: string };
    const data = req.body;

    // ✅ แก้ไข 1: ดัก undefined ก่อนใช้งาน (สำคัญมาก)
    const files = (req.files as FileDict) || {};

    // ดึงไฟล์ออกมา (ถ้าไม่มีจะเป็น undefined)
    const newPosterFile = files["course_poster"]?.[0];
    const newImageFiles = files["image_course"] || [];

    // เช็คว่ามีคอร์สอยู่จริงไหมก่อน
    const checkCourse = await getCourseByIdService({ id });

    if (!checkCourse) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Course not found",
      });
      return;
    }

    // เตรียม Payload จาก Body (ข้อมูล Text)
    const payload: any = {
      ...data,
      price: Number(data.price),
      discount_price: Number(data.discount_price),
    };

    console.log(data);

    // ✅ แก้ไข 2: จัดการ Logic รูปภาพ
    // ใส่ Logic เฉพาะเมื่อมีไฟล์ใหม่ถูกส่งมาเท่านั้น

    if (newPosterFile) {
      // ⚠️ Note: ปกติเราเก็บ path หรือ url ลง DB ไม่ใช่ทั้ง Object File
      // เช็ค Service ของคุณว่ารับค่าแบบไหน (ถ้า service รับ File object ก็ใช้ newPosterFile ได้เลย)
      // แต่ถ้า service คาดหวัง string path ให้ใช้ .path หรือ .filename
      payload.cover_image = newPosterFile.path;
    }
    // ถ้าไม่มีไฟล์ใหม่ ไม่ต้องทำอะไร (Prisma จะใช้ค่าเดิมที่มีใน DB เอง ไม่ต้องไปดึง checkCourse มาแปะ)

    if (newImageFiles && newImageFiles.length > 0) {
      // แปลง File[] เป็น string[] path (ถ้า Service ต้องการ path)
      payload.images = newImageFiles.map((f) => f.path);
    }

    const course = await updateCourseService({
      id,
      data: payload,
    });

    if (!course) {
      // Double check แต่จริงๆ ถ้าผ่าน getCourseByIdService มาแล้ว น่าจะไม่ติดตรงนี้
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Update failed or Course not found",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Course updated successfully",
      data: course,
    });
    return;
  } catch (error: Error | unknown) {
    console.error("Update Course Error:", error);
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
  adminDeleteCourseController,
  updateCourseStatusController,
  updateCourseController,
};
