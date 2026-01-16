import { Request, Response } from "express"; // หรือ NextRequest ของ Next.js
import { CouponService } from "../services/coupon.service";

const couponService = new CouponService();

export class CouponController {
  /**
   * POST /api/coupons/verify
   * Body: { code: string, cartTotal: number, userId: string }
   */
  async verifyCoupon(req: Request, res: Response) {
    try {
      const { code, cartTotal, userId } = req.body;

      console.log(req.body);

      if (!code || !cartTotal || !userId) {
        return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
      }

      const result = await couponService.validateAndCalculate(
        code,
        userId,
        Number(cartTotal)
      );

      if (!result.valid) {
        // คืนค่า 400 หรือ 422 ถ้าคูปองใช้ไม่ได้
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
    }
  }

  /**
   * POST /api/coupons (Admin Only)
   */
  async createCoupon(req: Request, res: Response) {
    try {
      const newCoupon = await couponService.createCoupon(req.body);
      return res.status(201).json(newCoupon);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "ไม่สามารถสร้างคูปองได้" });
    }
  }

  async getAllCoupons(req: Request, res: Response) {
    try {
      const coupons = await couponService.getAllCoupons();
      return res.status(200).json(coupons);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
    }
  }

  async updateStatusCoupon(req: Request, res: Response) {
    try {
      const updatedCoupon = await couponService.updateStatusCoupon(
        req.params.id as string,
        req.body
      );
      return res.status(200).json(updatedCoupon);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
    }
  }

  async deleteCoupon(req: Request, res: Response) {
    try {
      const deletedCoupon = await couponService.deleteCoupon(
        req.params.id as string
      );
      return res.status(200).json(deletedCoupon);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
    }
  }
}
