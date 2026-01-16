"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyRoundService = exports.deleteCourseService = exports.getMyCourseService = exports.getCourseRoundTodayOrMonthService = exports.getCourseRoundByCourseIdService = exports.getCourseByIdService = exports.getCourseRoundByIdService = exports.getCourseRoundService = exports.createCourseRoundService = exports.getCourseService = exports.createCourseService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createCourseService = async ({ payload, }) => {
    try {
        const course = await prisma_1.default.courseYoga.create({ data: payload });
        return course;
    }
    catch (error) {
        throw error;
    }
};
exports.createCourseService = createCourseService;
const createCourseRoundService = async ({ payload, }) => {
    try {
        const courseRound = await prisma_1.default.courseRound.create({ data: payload });
        return courseRound;
    }
    catch (error) {
        throw error;
    }
};
exports.createCourseRoundService = createCourseRoundService;
const getCourseService = async ({ limit = 10, // ค่า Default
offset = 0, // ค่า Default
search, }) => {
    try {
        // สร้างเงื่อนไขการค้นหา (Where Clause)
        const whereCondition = {
            status: "Draft", // หรือ "Open" ตาม Business Logic ว่าอยากให้เห็นคอร์สสถานะไหนบ้าง
            ...(search && {
                title: {
                    contains: search,
                    mode: "insensitive", // ค้นหาแบบไม่สนตัวพิมพ์เล็ก-ใหญ่
                },
            }),
        };
        // ใช้ Promise.all เพื่อทำงานคู่ขนาน (เร็วกว่ารอทีละอัน)
        const [courses, total] = await Promise.all([
            prisma_1.default.courseYoga.findMany({
                take: limit,
                skip: offset,
                where: whereCondition,
                orderBy: {
                    createdAt: "desc", // เอาคอร์สใหม่ล่าสุดขึ้นก่อน
                },
                // ดึงข้อมูลที่เกี่ยวข้องมาด้วย
                include: {
                    teacher: {
                        // Teacher
                        select: {
                            id: true,
                            email: true,
                            // firstName: true, (ถ้ามีใน UserInfo ให้ join ต่อ)
                        },
                    },
                },
            }),
            prisma_1.default.courseYoga.count({ where: whereCondition }),
        ]);
        return { courses, total };
    }
    catch (error) {
        throw error;
    }
};
exports.getCourseService = getCourseService;
const getMyCourseService = async ({ limit = 10, // ค่า Default
offset = 0, // ค่า Default
search, userId, }) => {
    try {
        const whereCondition = {
            status: "Draft", // หรือ "Open" ตาม Business Logic ว่าอยากให้เห็นคอร์สสถานะไหนบ้าง
            teacherId: userId,
            ...(search && {
                title: {
                    contains: search,
                    mode: "insensitive", // ค้นหาแบบไม่สนตัวพิมพ์เล็ก-ใหญ่
                },
            }),
        };
        const [courses, total] = await Promise.all([
            prisma_1.default.courseYoga.findMany({
                take: limit,
                skip: offset,
                where: whereCondition,
                orderBy: {
                    createdAt: "desc", // เอาคอร์สใหม่ล่าสุดขึ้นก่อน
                },
            }),
            prisma_1.default.courseYoga.count({ where: whereCondition }),
        ]);
        return { courses, total };
    }
    catch (error) {
        throw error;
    }
};
exports.getMyCourseService = getMyCourseService;
const getCourseRoundService = async ({ limit = 10, // ค่า Default
offset = 0, // ค่า Default
search, }) => {
    try {
        // สร้างเงื่อนไขการค้นหา (Where Clause)
        const whereCondition = {
            status: "Open", // หรือ "Open" ตาม Business Logic ว่าอยากให้เห็นคอร์สสถานะไหนบ้าง
        };
        // ใช้ Promise.all เพื่อทำงานคู่ขนาน (เร็วกว่ารอทีละอัน)
        const [courses, total] = await Promise.all([
            prisma_1.default.courseRound.findMany({
                take: limit,
                skip: offset,
                where: whereCondition,
                orderBy: {
                    createdAt: "desc", // เอาคอร์สใหม่ล่าสุดขึ้นก่อน
                },
                include: {
                    course: {
                        select: {
                            title: true,
                            cover_image: true,
                            images: true,
                            price: true,
                            discount_price: true,
                            status: true,
                            description: true,
                        },
                    },
                },
            }),
            prisma_1.default.courseRound.count({ where: whereCondition }),
        ]);
        return { courses, total };
    }
    catch (error) {
        throw error;
    }
};
exports.getCourseRoundService = getCourseRoundService;
const getCourseRoundByIdService = async ({ id }) => {
    try {
        const courseRound = await prisma_1.default.courseRound.findUnique({
            where: {
                id,
            },
        });
        return courseRound;
    }
    catch (error) {
        throw error;
    }
};
exports.getCourseRoundByIdService = getCourseRoundByIdService;
const getCourseByIdService = async ({ id }) => {
    try {
        const course = await prisma_1.default.courseYoga.findUnique({
            where: {
                id,
            },
            include: {
                teacher: {
                    include: {
                        userInfo: true,
                    },
                },
                rounds: {
                    orderBy: {
                        startDateTime: "asc",
                    },
                    where: { startDateTime: { gte: new Date() } },
                },
            },
        });
        return course;
    }
    catch (error) {
        console.error("Error fetching course:", error);
        throw error;
    }
};
exports.getCourseByIdService = getCourseByIdService;
const getCourseRoundByCourseIdService = async ({ id }) => {
    try {
        const courseRound = await prisma_1.default.courseRound.findMany({
            where: {
                courseId: id,
            },
            include: {
                course: {
                    select: {
                        title: true,
                        cover_image: true,
                        images: true,
                        price: true,
                        discount_price: true,
                        status: true,
                        description: true,
                    },
                },
            },
        });
        return courseRound;
    }
    catch (error) {
        throw error;
    }
};
exports.getCourseRoundByCourseIdService = getCourseRoundByCourseIdService;
const getCourseRoundTodayOrMonthService = async ({ today, month, }) => {
    let startQueryDate;
    let endQueryDate;
    if (today) {
        startQueryDate = new Date(`${today}T00:00:00`);
        endQueryDate = new Date(startQueryDate);
        endQueryDate.setDate(endQueryDate.getDate() + 1);
    }
    else if (month) {
        startQueryDate = new Date(`${month}-01T00:00:00`);
        endQueryDate = new Date(startQueryDate);
        endQueryDate.setMonth(endQueryDate.getMonth() + 1);
    }
    else {
        throw new Error("Parameter required: 'today' (YYYY-MM-DD) or 'month' (YYYY-MM)");
    }
    if (isNaN(startQueryDate.getTime()) || isNaN(endQueryDate.getTime())) {
        throw new Error(`Invalid Date format. Today: ${today}, Month: ${month}`);
    }
    try {
        const courseRound = await prisma_1.default.courseRound.findMany({
            where: {
                startDateTime: {
                    gte: startQueryDate, // ตั้งแต่เวลาเริ่ม
                    lt: endQueryDate, // น้อยกว่าเวลาจบ (ไม่รวมเวลาจบ)
                },
            },
            include: {
                course: {
                    select: {
                        title: true,
                        cover_image: true,
                        images: true,
                        price: true,
                        discount_price: true,
                        status: true,
                        description: true,
                        teacher: {
                            select: {
                                userInfo: {
                                    select: {
                                        avatar: true,
                                        sex: true,
                                        firstName: true,
                                        lastName: true,
                                        phone_number: true,
                                        experience: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return courseRound;
    }
    catch (error) {
        throw error;
    }
};
exports.getCourseRoundTodayOrMonthService = getCourseRoundTodayOrMonthService;
const deleteCourseService = async ({ id, userId, }) => {
    try {
        const course = await prisma_1.default.courseYoga.delete({
            where: {
                id,
                teacherId: userId,
            },
        });
        return course;
    }
    catch (error) {
        throw error;
    }
};
exports.deleteCourseService = deleteCourseService;
const getMyRoundService = async ({ userId }) => {
    try {
        // เปลี่ยนจาก findMany ที่ courseYoga เป็น findMany ที่ courseRound
        const rounds = await prisma_1.default.courseRound.findMany({
            where: {
                course: {
                    teacherId: userId, // Filter ว่าเอา Round ที่มาจาก Course ของ Teacher คนนี้
                },
            },
            include: {
                course: {
                    select: {
                        title: true,
                        cover_image: true,
                        description: true,
                    },
                },
            },
            orderBy: {
                startDateTime: "asc", // (Optional) เรียงตามเวลาเริ่ม
            },
        });
        return rounds; // จะได้ Array ของ Round โดยตรงเลย
    }
    catch (error) {
        throw error;
    }
};
exports.getMyRoundService = getMyRoundService;
