"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.BookingSchema = zod_1.default.object({
    studentId: zod_1.default.string(),
    roundId: zod_1.default.string(),
    price: zod_1.default.number(),
    type: zod_1.default.enum(["ONLINE", "WALK_IN"]),
    paidAt: zod_1.default.date().optional(),
    paymentId: zod_1.default.string().optional(),
    email: zod_1.default.string().optional(),
    quantity: zod_1.default.number().optional(),
    description: zod_1.default.string().min(1, "กรุณากรอกรายละเอียด").optional(),
    status: zod_1.default.enum(["PENDING", "PAID", "CANCELLED"]).default("PENDING"),
});
