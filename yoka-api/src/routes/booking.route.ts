import { Router } from "express";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import {
  createBookingController,
  getAllBookingController,
  getBookingByIdController,
  getBookingByUserIdController,
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
router.put(
  "/update-booking/:id",
  authMiddleware,
  restrictTo("Admin"),
  () => {}
);
router.delete(
  "/delete-booking/:id",
  authMiddleware,
  restrictTo("Admin"),
  () => {}
);

export default router;
