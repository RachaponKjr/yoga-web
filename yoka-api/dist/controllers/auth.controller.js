"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAllController = exports.getInstructorController = exports.updateProfileController = exports.getMeController = exports.logoutController = exports.loginController = exports.registerController = void 0;
const auth_type_1 = require("../types/auth.type");
const sendResponse_1 = require("../utils/sendResponse");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../services/auth.service");
const env_1 = require("../config/env");
const http_status_codes_1 = require("http-status-codes");
const file_utils_1 = require("../utils/file.utils");
const mail_1 = require("../utils/mail");
const registerController = async (req, res) => {
    try {
        const validateRegisterInput = auth_type_1.RegisterInputSchema.safeParse(req.body);
        if (!validateRegisterInput.success) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: 400,
                message: validateRegisterInput.error.issues
                    .map((issue) => issue.message)
                    .join(", "),
            });
            return;
        }
        const { email, password, role } = validateRegisterInput.data;
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const payload = { email, password: hashedPassword, role };
        const registerServiceRes = await (0, auth_service_1.registerService)({ payload });
        if (!registerServiceRes) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: 500,
                message: "Can't register user!",
            });
            return;
        }
        await mail_1.mailService.sendEmail(email, "Thank you for registering!", "<h1>Thank you for registering!</h1>");
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "User registered successfully",
            data: registerServiceRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Server error!",
        });
        return;
    }
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    try {
        const validateLoginInput = auth_type_1.LoginInputSchema.safeParse(req.body);
        if (!validateLoginInput.success) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: validateLoginInput.error.issues
                    .map((issue) => issue.message)
                    .join(", "),
            });
            return;
        }
        const { email, password } = validateLoginInput.data;
        const user = await (0, auth_service_1.checkUserExistService)({ email });
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "User not found!",
            });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "Invalid password!",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, env_1.config.jwtSecret, {
            expiresIn: env_1.config.jwtExpiresIn,
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                user,
            },
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.loginController = loginController;
const logoutController = async (req, res) => {
    try {
        res.clearCookie("token");
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "User logged out successfully",
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.logoutController = logoutController;
const getMeController = async (req, res) => {
    try {
        const user = req.user;
        const getUserServiceRes = await (0, auth_service_1.getUserService)({ id: user.id });
        if (!getUserServiceRes) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "User not found!",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "User logged in successfully",
            data: getUserServiceRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.getMeController = getMeController;
const updateProfileController = async (req, res) => {
    try {
        const user = req.user;
        const payload = req.body;
        const avatar = req.file;
        console.log(req.file, "req.file");
        const checkAvatar = await (0, auth_service_1.getUserService)({ id: user.id });
        if (checkAvatar?.userInfo?.avatar) {
            (0, file_utils_1.removeFile)(checkAvatar.userInfo.avatar);
        }
        if (avatar) {
            payload.avatar = avatar.path;
        }
        const updateUserRes = await (0, auth_service_1.updateProfilService)({ id: user.id, payload });
        if (!updateUserRes) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "User not found!",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Update profile successfully",
            data: updateUserRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.updateProfileController = updateProfileController;
// lnstructor
const getInstructorController = async (req, res) => {
    try {
        const instructorRes = await (0, auth_service_1.getInstructorService)();
        if (!instructorRes) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Instructor not found!",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Instructor found successfully",
            data: instructorRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.getInstructorController = getInstructorController;
const getUserAllController = async (req, res) => {
    try {
        const userRes = await (0, auth_service_1.getUserAllService)();
        if (!userRes) {
            (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "User not found!",
            });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "User found successfully",
            data: userRes,
        });
        return;
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server error!",
        });
        return;
    }
};
exports.getUserAllController = getUserAllController;
