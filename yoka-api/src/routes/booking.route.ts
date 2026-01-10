import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import {
  createBookingController,
  getAllBookingController,
  getBookingByIdController,
  getBookingByUserIdController,
  updateBookingController,
} from "../controllers/booking.controller";
const router = Router();

router.post("/create-booking", authMiddleware, createBookingController);
router.get(
  "/all-booking",
  authMiddleware,
  restrictTo("Admin"),
  getAllBookingController
);
router.get("/:id", authMiddleware, getBookingByIdController);
router.get("/booking-user/:id", authMiddleware, getBookingByUserIdController);
router.patch(
  "/update-booking/:id",
  authMiddleware,
  restrictTo("Admin"),
  updateBookingController
);
router.delete(
  "/delete-booking/:id",
  authMiddleware,
  restrictTo("Admin"),
  () => {}
);

export default router;
