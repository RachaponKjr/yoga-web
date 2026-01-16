"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const course_controller_1 = require("../controllers/course.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.authMiddleware, (0, auth_middleware_1.restrictTo)("Admin", "Instructor"), (0, upload_middleware_1.createUploader)("courses").fields([
    { name: "course_poster", maxCount: 1 }, // รับ 1 รูป
    { name: "image_course", maxCount: 10 }, // รับได้สูงสุด 10 รูป
]), course_controller_1.createCourseController);
router.post("/set-round", auth_middleware_1.authMiddleware, (0, auth_middleware_1.restrictTo)("Admin", "Instructor"), course_controller_1.createCourseRoundController);
router.get("/all", 
// authMiddleware,
// restrictTo("Admin", "Instructor"),
course_controller_1.getCourseController);
router.get("/course/:id", course_controller_1.getCourseByIdController);
router.get("/my-course/:id", auth_middleware_1.authMiddleware, course_controller_1.getMyCourseController);
router.delete("/delete/:id", auth_middleware_1.authMiddleware, course_controller_1.deleteCourseController);
router.get("/rounds", course_controller_1.getCourseRoundController);
router.get("/round-coursesId/:id", course_controller_1.getCourseRoundByCourseIdController);
router.get("/round-today-or-month", course_controller_1.getCourseRoundTodayOrMonthController);
router.get("/round-my-round", auth_middleware_1.authMiddleware, course_controller_1.getMyRoundController);
router.get("/round/:id", course_controller_1.getCourseRoundByIdController);
router.put("/update/:id", () => { });
router.delete("/delete/:id", () => { });
exports.default = router;
