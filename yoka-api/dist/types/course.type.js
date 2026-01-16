"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoundSchema = exports.CourseYogaSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.CourseYogaSchema = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    price: zod_1.default.number().min(1),
    discount_price: zod_1.default.number().optional(),
    cover_image: zod_1.default.string().optional(),
    images: zod_1.default.string().array().optional(),
    teacherId: zod_1.default.string(),
});
exports.CourseRoundSchema = zod_1.default.object({
    courseId: zod_1.default.string(),
    startDateTime: zod_1.default.coerce.date().default(new Date()),
    endDateTime: zod_1.default.coerce.date().default(new Date()),
    max_online: zod_1.default.number().default(0),
    max_walk_in: zod_1.default.number().default(0),
    current_online: zod_1.default.number().default(0),
    current_walk_in: zod_1.default.number().default(0),
});
