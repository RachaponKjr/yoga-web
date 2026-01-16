"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCardChargeService = void 0;
const omise_1 = __importDefault(require("../config/omise")); // config เดิม
const AppError_1 = require("../utils/AppError");
const http_status_codes_1 = require("http-status-codes");
const createCardChargeService = async ({ amount, token, orderId, couponId, email, }) => {
    try {
        const charge = await omise_1.default.charges.create({
            amount: Math.round(amount * 100), // แปลงบาทเป็นสตางค์
            currency: "thb",
            card: token, // ⭐ หัวใจสำคัญ: ส่ง Token แทนเลขบัตร
            description: `Order ID: ${orderId}`,
            metadata: {
                orderId: orderId,
                email: email,
                discountAmount: amount,
                couponId: couponId,
            },
            // 3D Secure: ต้องระบุ return_uri เพื่อให้ธนาคารเด้งกลับมาหาเราหลังใส่ OTP
            return_uri: `${process.env.REDIRECT_URL}/payment/complete?orderId=${orderId}`,
        });
        return charge;
    }
    catch (error) {
        throw new AppError_1.AppError(`Omise Card Error: ${error.message}`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
};
exports.createCardChargeService = createCardChargeService;
