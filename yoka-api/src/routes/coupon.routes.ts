import { Router } from "express";
import { CouponController } from "../controllers/coupon.controller";

const router = Router();
const controller = new CouponController();

// ลูกค้ากดใช้คูปอง
router.post("/verify", controller.verifyCoupon.bind(controller));
router.get("/", controller.getAllCoupons.bind(controller));
router.patch("/:id", controller.updateStatusCoupon.bind(controller));
// แอดมินสร้างคูปอง
router.post("/", controller.createCoupon.bind(controller));
router.delete("/:id", controller.deleteCoupon.bind(controller));

export default router;
