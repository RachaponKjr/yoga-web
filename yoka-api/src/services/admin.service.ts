import prisma from "../config/prisma";
import { PaymentStatus, Role, Sex, Status } from "@prisma/client";
import { UserEditState } from "../controllers/admin.controller";

export const getStatsService = async () => {
  // 1. เตรียมตัวแปรสำหรับหา "คลาสเรียนวันนี้"
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  // ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกัน 5 ส่วน (เร็วเกือบเท่า query เดียว)
  const [
    totalUsers,
    totalBookings,
    classesToday,
    totalRevenue,
    monthlyRevenue,
  ] = await Promise.all([
    // ---------------------------------------------
    // 1. จำนวน User ทั้งหมด
    // ---------------------------------------------
    prisma.user.count(),

    // ---------------------------------------------
    // 2. ยอดการจองทั้งหมด (แยกตามสถานะให้ด้วยเผื่อใช้)
    // ---------------------------------------------
    prisma.booking.count(),

    // ---------------------------------------------
    // 3. จำนวนคลาสวันนี้ (CourseRound)
    // ---------------------------------------------
    prisma.courseRound.count({
      where: {
        startDateTime: {
          gte: startOfDay, // มากกว่าหรือเท่ากับ 00:00
          lte: endOfDay, // น้อยกว่าหรือเท่ากับ 23:59
        },
        // อาจจะกรอง Status ด้วย เช่น ไม่เอาคลาสที่ถูกยกเลิก (ถ้ามี status Cancel)
        status: {
          not: Status.Draft, // ตัวอย่าง: ไม่นับคลาสที่เป็น Draft
        },
      },
    }),

    // ---------------------------------------------
    // 4. รายได้รวมทั้งหมด (เฉพาะที่จ่ายเงินแล้ว: PAID)
    // ---------------------------------------------
    prisma.booking.aggregate({
      _sum: {
        price: true,
      },
      where: {
        status: PaymentStatus.PAID,
      },
    }),

    // ---------------------------------------------
    // 5. รายได้ในแต่ละเดือน (Graph Data)
    // หมายเหตุ: ใช้ Raw Query เพราะ Prisma groupBy ยังไม่รองรับ Date Truncate ได้ดีพอใน PG
    // ---------------------------------------------
    prisma.$queryRaw`
      SELECT 
        TO_CHAR("paidAt", 'YYYY-MM') as month, 
        SUM(price) as total_revenue,
        COUNT(id) as booking_count
      FROM "Booking"
      WHERE status = 'PAID' AND "paidAt" IS NOT NULL
      GROUP BY TO_CHAR("paidAt", 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12;
    `,
  ]);

  // คืนค่ากลับไป
  return {
    users: {
      total: totalUsers,
    },
    bookings: {
      total: totalBookings,
    },
    classes: {
      today: classesToday,
    },
    revenue: {
      total: totalRevenue._sum.price || 0,
      monthly: monthlyRevenue, // Array ของรายได้แต่ละเดือน
    },
  };
};

export const getBookingListService = async () => {
  const bookings = await prisma.booking.findMany({
    where: {
      status: {
        in: ["PAID", "PENDING"],
      },
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      // ดึงข้อมูลคนจอง (User + UserInfo)
      student: {
        select: {
          email: true,
          userInfo: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
              phone_number: true,
            },
          },
        },
      },
      // ดึงข้อมูลรอบเรียน และคอร์ส
      round: {
        select: {
          startDateTime: true,
          endDateTime: true,
          course: {
            select: {
              title: true, // ชื่อคอร์ส
              cover_image: true, // รูปปกคอร์ส
            },
          },
        },
      },
    },
  });

  return bookings;
};

export const updateUserService = async (
  userId: string,
  profile: UserEditState,
) => {
  const {
    firstName,
    lastName,
    sex,
    phone_number,
    country,
    facebook,
    instagram,
    twitter,
    role,
    experience,
  } = profile;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role as Role,
      userInfo: {
        update: {
          firstName,
          lastName,
          sex: (sex === "NotSpecify" || sex === "" ? "NotSpecify" : sex) as Sex,
          phone_number,
          country,
          facebook,
          instagram,
          twitter,
          experience,
        },
      },
    },
    include: {
      userInfo: true,
    },
  });

  return updatedUser;
};

export const getMonitorCountryStatsService = async () => {
  const stats = await prisma.userInfo.groupBy({
    by: ["country"],
    _count: {
      userId: true,
    },
    where: {
      AND: [
        { country: { not: null } },
        { country: { not: "" } }, // กรองค่าว่างที่เป็น String เปล่า
      ],
    },
    orderBy: {
      _count: {
        userId: "desc",
      },
    },
  });

  const formattedStats = stats.map((item) => ({
    country: item.country,
    count: item._count.userId,
  }));

  return formattedStats;
};
