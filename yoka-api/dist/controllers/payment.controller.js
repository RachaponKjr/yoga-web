"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chargeCardController = void 0;
const http_status_codes_1 = require("http-status-codes");
const payment_service_1 = require("../services/payment.service");
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const chargeCardController = async (req, res) => {
    try {
        // Frontend ต้องส่ง 2 ค่านี้มา
        const { orderId, omiseToken, couponId } = req.body;
        if (!omiseToken) {
            throw new AppError_1.AppError("Omise Token is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        // 1. ดึงข้อมูล Order เพื่อเอายอดเงินจริง (ห้ามเชื่อยอดเงินจาก Frontend)
        const order = await prisma_1.default.booking.findUnique({
            where: { id: orderId },
            include: { student: true }, // ดึง email user มาด้วย (ถ้ามี)
        });
        if (!order) {
            throw new AppError_1.AppError("Order not found", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        // 2. สั่งตัดบัตร
        const charge = await (0, payment_service_1.createCardChargeService)({
            couponId: couponId,
            amount: order.price,
            token: omiseToken,
            orderId: order.id,
            email: order.student?.email,
        });
        const is3DSecure = charge.status === "pending" && charge.authorize_uri;
        await prisma_1.default.$transaction(async (tx) => {
            const updatedCoupon = await tx.coupon.update({
                where: { id: couponId },
                data: {
                    currentUses: {
                        increment: 1,
                    },
                },
            });
            if (updatedCoupon.usageLimit !== null &&
                updatedCoupon.currentUses > updatedCoupon.usageLimit) {
                throw new Error("Coupon usage limit exceeded during transaction");
            }
            await tx.couponUsage.create({
                data: {
                    discount: order.price, // เช็คให้ชัวร์ว่าตัวแปรนี้คือ "ยอดเงินส่วนลด" ไม่ใช่ "ราคาสินค้า"
                    usedAt: new Date(),
                    orderId: orderId,
                    couponId: couponId,
                    userId: order.student?.id || "",
                },
            });
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: is3DSecure
                ? "Please proceed to 3D Secure"
                : "Payment successful",
            data: {
                chargeId: charge.id,
                status: charge.status,
                authorizeUri: charge.authorize_uri, // Frontend ต้อง redirect user ไปที่นี่ถ้ามีค่า
            },
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.chargeCardController = chargeCardController;
