import { CourseRoundType, CourseYogaType } from "../types/course.type";
import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

interface GetCourseParams {
  limit?: number;
  offset?: number;
  search?: string; // เพิ่มฟังก์ชันค้นหาชื่อคอร์ส
}

const createCourseService = async ({
  payload,
}: {
  payload: CourseYogaType;
}) => {
  try {
    const course = await prisma.courseYoga.create({ data: payload });
    return course;
  } catch (error) {
    throw error;
  }
};

const createCourseRoundService = async ({
  payload,
}: {
  payload: CourseRoundType;
}) => {
  try {
    const courseRound = await prisma.courseRound.create({ data: payload });
    return courseRound;
  } catch (error) {
    throw error;
  }
};

const getCourseService = async ({
  limit = 10, // ค่า Default
  offset = 0, // ค่า Default
  search,
}: GetCourseParams) => {
  try {
    // สร้างเงื่อนไขการค้นหา (Where Clause)
    const whereCondition: Prisma.CourseYogaWhereInput = {
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
      prisma.courseYoga.findMany({
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
      prisma.courseYoga.count({ where: whereCondition }),
    ]);

    return { courses, total };
  } catch (error) {
    throw error;
  }
};

const getMyCourseService = async ({
  limit = 10, // ค่า Default
  offset = 0, // ค่า Default
  search,
  userId,
}: GetCourseParams & { userId: string }) => {
  try {
    const whereCondition: Prisma.CourseYogaWhereInput = {
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
      prisma.courseYoga.findMany({
        take: limit,
        skip: offset,
        where: whereCondition,
        orderBy: {
          createdAt: "desc", // เอาคอร์สใหม่ล่าสุดขึ้นก่อน
        },
      }),
      prisma.courseYoga.count({ where: whereCondition }),
    ]);

    return { courses, total };
  } catch (error) {
    throw error;
  }
};

const getCourseRoundService = async ({
  limit = 10, // ค่า Default
  offset = 0, // ค่า Default
  search,
}: GetCourseParams) => {
  try {
    // สร้างเงื่อนไขการค้นหา (Where Clause)
    const whereCondition: Prisma.CourseRoundWhereInput = {
      status: "Open", // หรือ "Open" ตาม Business Logic ว่าอยากให้เห็นคอร์สสถานะไหนบ้าง
    };

    // ใช้ Promise.all เพื่อทำงานคู่ขนาน (เร็วกว่ารอทีละอัน)
    const [courses, total] = await Promise.all([
      prisma.courseRound.findMany({
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
      prisma.courseRound.count({ where: whereCondition }),
    ]);

    return { courses, total };
  } catch (error) {
    throw error;
  }
};

const getCourseRoundByIdService = async ({ id }: { id: string }) => {
  try {
    const courseRound = await prisma.courseRound.findUnique({
      where: {
        id,
      },
    });

    return courseRound;
  } catch (error) {
    throw error;
  }
};

const getCourseByIdService = async ({ id }: { id: string }) => {
  try {
    const course = await prisma.courseYoga.findUnique({
      where: {
        id,
      },
      include: {
        rounds: {
          orderBy: {
            startDateTime: "asc", // เรียงจากวันที่ใกล้ที่สุดไปหาอนาคต
          },
          // หากต้องการเอาเฉพาะรอบที่ยังไม่หมดเวลา สามารถใส่ where เพิ่มได้
          where: { startDateTime: { gte: new Date() } },
        },
      },
    });

    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

const getCourseRoundByCourseIdService = async ({ id }: { id: string }) => {
  try {
    const courseRound = await prisma.courseRound.findMany({
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
  } catch (error) {
    throw error;
  }
};

const getCourseRoundTodayOrMonthService = async ({
  today,
  month,
}: {
  today?: string; // ใส่ ? เพื่อบอกว่าอาจจะไม่ส่งมาก็ได้
  month?: string;
}) => {
  let startQueryDate: Date;
  let endQueryDate: Date;

  // CASE 1: ค้นหารายวัน (Today)
  if (today) {
    startQueryDate = new Date(`${today}T00:00:00`);

    // จบที่ 00:00 ของวันถัดไป
    endQueryDate = new Date(startQueryDate);
    endQueryDate.setDate(endQueryDate.getDate() + 1);
  }
  // CASE 2: ค้นหารายเดือน (Month)
  else if (month) {
    // สมมติ month ส่งมาเป็น "YYYY-MM" เช่น "2023-11"
    // เริ่มวันที่ 1 ของเดือนนั้น
    startQueryDate = new Date(`${month}-01T00:00:00`);

    // จบที่วันที่ 1 ของเดือนถัดไป (Prisma จะหาแบบ < endQueryDate คือไม่รวมวันเริ่มต้นของเดือนถัดไป)
    endQueryDate = new Date(startQueryDate);
    endQueryDate.setMonth(endQueryDate.getMonth() + 1);
  }
  // CASE 3: ไม่ส่งอะไรมาเลย
  else {
    throw new Error(
      "Parameter required: 'today' (YYYY-MM-DD) or 'month' (YYYY-MM)"
    );
  }

  // เช็คว่าวันที่ถูกต้องหรือไม่ (กัน User ส่ง string มั่วๆ มา)
  if (isNaN(startQueryDate.getTime()) || isNaN(endQueryDate.getTime())) {
    throw new Error(`Invalid Date format. Today: ${today}, Month: ${month}`);
  }

  try {
    const courseRound = await prisma.courseRound.findMany({
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
  } catch (error) {
    throw error;
  }
};

const deleteCourseService = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  try {
    const course = await prisma.courseYoga.delete({
      where: {
        id,
        teacherId: userId,
      },
    });
    return course;
  } catch (error) {
    throw error;
  }
};

export {
  createCourseService,
  getCourseService,
  createCourseRoundService,
  getCourseRoundService,
  getCourseRoundByIdService,
  getCourseByIdService,
  getCourseRoundByCourseIdService,
  getCourseRoundTodayOrMonthService,
  getMyCourseService,
  deleteCourseService,
};
