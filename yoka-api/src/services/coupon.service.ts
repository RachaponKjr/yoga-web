import { PrismaClient, Coupon } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

// Interface สำหรับ Return ค่ากลับไป
interface CouponValidationResult {
  id: string;
  valid: boolean;
  code?: string;
  discountAmount: number; // แปลงเป็น number ให้ frontend ใช้ง่าย
  finalPrice: number;
  message: string;
}

export class CouponService {
  /**
   * ตรวจสอบและคำนวณส่วนลด (ใช้ตอนกดปุ่ม "ใช้คูปอง" ในหน้าตะกร้า)
   */
  async validateAndCalculate(
    code: string,
    userId: string,
    cartTotal: number
  ): Promise<CouponValidationResult> {
    const total = new Decimal(cartTotal);

    // 1. ค้นหาคูปอง
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    // --- Validation Logic ---

    if (!coupon) {
      return this.responseError("ไม่พบรหัสคูปองนี้");
    }

    if (!coupon.isActive) {
      return this.responseError("คูปองนี้ถูกยกเลิกแล้ว");
    }

    const now = new Date();
    if (now < coupon.startDate) {
      return this.responseError("คูปองนี้ยังไม่ถึงเวลาเริ่มใช้งาน");
    }

    if (now > coupon.endDate) {
      return this.responseError("คูปองนี้หมดอายุแล้ว");
    }

    if (coupon.usageLimit !== null && coupon.currentUses >= coupon.usageLimit) {
      return this.responseError("สิทธิ์คูปองนี้เต็มแล้ว");
    }

    if (coupon.minSpend && total.lessThan(coupon.minSpend)) {
      return this.responseError(`ยอดซื้อขั้นต่ำต้อง ${coupon.minSpend} บาท`);
    }

    // เช็คว่า User คนนี้เคยใช้หรือยัง
    const userUsage = await prisma.couponUsage.count({
      where: { couponId: coupon.id, userId: userId },
    });

    if (coupon.userLimit !== null && userUsage >= coupon.userLimit) {
      return this.responseError("คุณใช้สิทธิ์คูปองนี้ครบกำหนดแล้ว");
    }

    // --- Calculation Logic ---

    let discount = new Decimal(0);

    if (coupon.type === "FIXED_AMOUNT") {
      discount = coupon.value;
    } else if (coupon.type === "PERCENTAGE") {
      discount = total.mul(coupon.value).div(100);

      // Cap ยอดลดสูงสุด
      if (coupon.maxDiscount && discount.greaterThan(coupon.maxDiscount)) {
        discount = coupon.maxDiscount;
      }
    }

    // ส่วนลดห้ามเกินราคาสินค้า
    if (discount.greaterThan(total)) {
      discount = total;
    }

    const finalPrice = total.minus(discount);

    return {
      id: coupon.id,
      valid: true,
      code: coupon.code,
      discountAmount: discount.toNumber(),
      finalPrice: finalPrice.toNumber(),
      message: "ใช้คูปองสำเร็จ",
    };
  }

  /**
   * สร้างคูปองใหม่ (สำหรับ Admin)
   */
  async createCoupon(data: any) {
    // แปลง number เป็น Decimal ก่อน save
    return await prisma.coupon.create({
      data: {
        ...data,
        value: new Decimal(data.value),
        minSpend: data.minSpend ? new Decimal(data.minSpend) : undefined,
        maxDiscount: data.maxDiscount
          ? new Decimal(data.maxDiscount)
          : undefined,
      },
    });
  }

  /**
   * ดึงคูปองทั้งหมด (สำหรับ Admin)
   */
  async getAllCoupons() {
    return await prisma.coupon.findMany();
  }

  async updateStatusCoupon(id: string, data: any) {
    return await prisma.coupon.update({
      where: { id },
      data: {
        isActive: data.isActive,
      },
    });
  }

  async deleteCoupon(id: string) {
    return await prisma.coupon.delete({
      where: { id },
    });
  }

  // Helper สำหรับ return error object
  private responseError(message: string): CouponValidationResult {
    return {
      id: "",
      valid: false,
      discountAmount: 0,
      finalPrice: 0,
      message,
    };
  }
}
