"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupon_controller_1 = require("../controllers/coupon.controller");
const router = (0, express_1.Router)();
const controller = new coupon_controller_1.CouponController();
// ลูกค้ากดใช้คูปอง
router.post("/verify", controller.verifyCoupon.bind(controller));
router.get("/", controller.getAllCoupons.bind(controller));
router.patch("/:id", controller.updateStatusCoupon.bind(controller));
// แอดมินสร้างคูปอง
router.post("/", controller.createCoupon.bind(controller));
router.delete("/:id", controller.deleteCoupon.bind(controller));
exports.default = router;
