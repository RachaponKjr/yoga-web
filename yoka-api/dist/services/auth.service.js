"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAllService = exports.getInstructorService = exports.updateProfilService = exports.getUserService = exports.checkUserExistService = exports.registerService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const registerService = async ({ payload }) => {
    const res = await prisma_1.default.user.create({
        data: {
            ...payload,
            userInfo: {
                create: {},
            },
        },
    });
    return res;
};
exports.registerService = registerService;
const checkUserExistService = async ({ email }) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email,
        },
        include: {
            userInfo: true,
        },
    });
    return user;
};
exports.checkUserExistService = checkUserExistService;
const getUserService = async ({ id }) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            role: true,
            email: true,
            userInfo: {
                select: {
                    sex: true,
                    avatar: true,
                    firstName: true,
                    lastName: true,
                    experience: true,
                    facebook: true,
                    instagram: true,
                    twitter: true,
                    phone_number: true,
                    country: true,
                },
            },
        },
    });
    return user;
};
exports.getUserService = getUserService;
const updateProfilService = async ({ id, payload, }) => {
    const user = await prisma_1.default.userInfo.update({
        where: {
            userId: id,
        },
        data: {
            ...payload,
        },
    });
    return user;
};
exports.updateProfilService = updateProfilService;
const getInstructorService = async () => {
    const user = await prisma_1.default.user.findMany({
        where: {
            role: "Instructor",
        },
        select: {
            id: true,
            role: true,
            email: true,
            userInfo: {
                select: {
                    sex: true,
                    avatar: true,
                    firstName: true,
                    lastName: true,
                    experience: true,
                    facebook: true,
                    instagram: true,
                    twitter: true,
                },
            },
        },
    });
    return user;
};
exports.getInstructorService = getInstructorService;
const getUserAllService = async () => {
    const user = await prisma_1.default.user.findMany({
        include: { userInfo: true, bookings: true },
    });
    return user;
};
exports.getUserAllService = getUserAllService;
