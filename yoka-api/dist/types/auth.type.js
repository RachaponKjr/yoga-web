"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileInputSchema = exports.LoginInputSchema = exports.RegisterInputSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.RegisterInputSchema = zod_1.default.object({
    email: zod_1.default.string().email({ message: "Invalid email" }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    role: zod_1.default.enum(["Student", "Instructor"]).default("Student"),
});
exports.LoginInputSchema = zod_1.default.object({
    email: zod_1.default.string().email({ message: "Invalid email" }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});
exports.UpdateProfileInputSchema = zod_1.default.object({
    avatar: zod_1.default.string().optional(),
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
    phone_number: zod_1.default.string().optional(),
    sex: zod_1.default.enum(["Male", "Female"]).optional(),
    experience: zod_1.default.string().optional(),
    facebook: zod_1.default.string().optional(),
    instagram: zod_1.default.string().optional(),
    twitter: zod_1.default.string().optional(),
});
