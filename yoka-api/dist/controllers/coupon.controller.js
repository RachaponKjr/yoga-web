"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const coupon_service_1 = require("../services/coupon.service");
const couponService = new coupon_service_1.CouponService();
class CouponController {
    /**
     * POST /api/coupons/verify
     * Body: { code: string, cartTotal: number, userId: string }
     */
    async verifyCoupon(req, res) {
        try {
            const { code, cartTotal, userId } = req.body;
            console.log(req.body);
            if (!code || !cartTotal || !userId) {
                return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
            }
            const result = await couponService.validateAndCalculate(code, userId, Number(cartTotal));
            if (!result.valid) {
                // คืนค่า 400 หรือ 422 ถ้าคูปองใช้ไม่ได้
                return res.status(400).json(result);
            }
            return res.status(200).json(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
        }
    }
    /**
     * POST /api/coupons (Admin Only)
     */
    async createCoupon(req, res) {
        try {
            const newCoupon = await couponService.createCoupon(req.body);
            return res.status(201).json(newCoupon);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "ไม่สามารถสร้างคูปองได้" });
        }
    }
    async getAllCoupons(req, res) {
        try {
            const coupons = await couponService.getAllCoupons();
            return res.status(200).json(coupons);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
        }
    }
    async updateStatusCoupon(req, res) {
        try {
            const updatedCoupon = await couponService.updateStatusCoupon(req.params.id, req.body);
            return res.status(200).json(updatedCoupon);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
        }
    }
    async deleteCoupon(req, res) {
        try {
            const deletedCoupon = await couponService.deleteCoupon(req.params.id);
            return res.status(200).json(deletedCoupon);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
        }
    }
}
exports.CouponController = CouponController;
