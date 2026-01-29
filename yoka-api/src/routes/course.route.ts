import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import {
  adminDeleteCourseController,
  createCourseController,
  createCourseRoundController,
  deleteCourseController,
  getCourseActiveController,
  getCourseByIdController,
  getCourseController,
  getCourseRoundByCourseIdController,
  getCourseRoundByIdController,
  getCourseRoundController,
  getCourseRoundTodayOrMonthController,
  getMyCourseController,
  getMyRoundController,
  updateCourseController,
  updateCourseStatusController,
} from "../controllers/course.controller";
import { createUploader } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  restrictTo("Admin", "Instructor"),
  createUploader("courses").fields([
    { name: "course_poster", maxCount: 1 }, // รับ 1 รูป
    { name: "image_course", maxCount: 10 }, // รับได้สูงสุด 10 รูป
  ]),
  createCourseController,
);
router.post(
  "/set-round",
  authMiddleware,
  restrictTo("Admin", "Instructor"),
  createCourseRoundController,
);
router.get(
  "/all",
  // authMiddleware,
  // restrictTo("Admin", "Instructor"),
  getCourseController,
);

router.get("/", getCourseActiveController);

router.get("/course/:id", getCourseByIdController);
router.get("/my-course/:id", authMiddleware, getMyCourseController);
router.delete("/delete/:id", authMiddleware, deleteCourseController);

router.get("/rounds", getCourseRoundController);
router.get("/round-coursesId/:id", getCourseRoundByCourseIdController);
router.get("/round-today-or-month", getCourseRoundTodayOrMonthController);
router.get("/round-my-round", authMiddleware, getMyRoundController);

router.get("/round/:id", getCourseRoundByIdController);
router.patch(
  "/status/:id",
  authMiddleware,
  restrictTo("Admin", "Instructor"),
  updateCourseStatusController,
);
router.patch(
  "/update/:id",
  authMiddleware,
  restrictTo("Admin", "Instructor"),
  updateCourseController,
);
router.delete(
  "/adminDelete/:id",
  authMiddleware,
  restrictTo("Admin", "Instructor"),
  createUploader("courses").fields([
    { name: "course_poster", maxCount: 1 }, // รับ 1 รูป
    { name: "image_course", maxCount: 10 }, // รับได้สูงสุด 10 รูป
  ]),
  adminDeleteCourseController,
);

export default router;
