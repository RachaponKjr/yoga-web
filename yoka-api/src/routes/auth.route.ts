import { Router } from "express";
import {
  getInstructorController,
  getMeController,
  getUserAllController,
  loginController,
  logoutController,
  registerController,
  updateProfileController,
} from "../controllers/auth.controller";
import { createUploader } from "../middlewares/upload.middleware";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", authMiddleware, logoutController);
router.get("/me", authMiddleware, getMeController);
router.patch(
  "/update-profile",
  authMiddleware,
  createUploader("avatar").single("avatar"),
  updateProfileController
);

router.get(
  "/users-all",
  authMiddleware,
  restrictTo("Admin"),
  getUserAllController
);

router.get("/get-instructor", getInstructorController);

export default router;
