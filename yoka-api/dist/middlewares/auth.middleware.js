"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
const authMiddleware = (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return next(new AppError_1.AppError("You are not logged in! Please log in to get access.", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new AppError_1.AppError("Invalid token or token expired", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    }
};
exports.authMiddleware = authMiddleware;
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return next(new AppError_1.AppError("You do not have permission to perform this action", http_status_codes_1.StatusCodes.FORBIDDEN));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
