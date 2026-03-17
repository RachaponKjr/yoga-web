import prisma from "../config/prisma";
import { PaymentStatus, Role, Sex, Status } from "@prisma/client";
import { UserEditState } from "../controllers/admin.controller";

export const getStatsService = async () => {
  const now = new Date();

  // 1. เตรียมช่วงเวลา "วันนี้"
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  // 2. เตรียมช่วงเวลา "เดือนนี้"
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  // ใช้ Promise.all ดึงข้อมูลพร้อมกัน
  const [
    totalUsers,
    totalBookings,
    classesToday,
    totalRevenue,
    currentMonthRevenue, // เพิ่มส่วนนี้
    monthlyRevenueHistory,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.courseRound.count({
      where: {
        startDateTime: { gte: startOfDay, lte: endOfDay },
        status: { not: Status.Draft },
      },
    }),
    // รายได้รวมทั้งหมด
    prisma.booking.aggregate({
      _sum: { price: true },
      where: { status: PaymentStatus.PAID },
    }),
    // รายได้เฉพาะเดือนนี้ (ที่คุณต้องการเพิ่ม)
    prisma.booking.aggregate({
      _sum: { price: true },
      where: {
        status: PaymentStatus.PAID,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
    // ข้อมูลรายเดือนย้อนหลัง (Raw Query)
    prisma.$queryRaw`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month, 
        SUM(price)::FLOAT as total_revenue,
        COUNT(id)::INT as booking_count
      FROM "Booking"
      WHERE status = 'PAID'
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12;
    `,
  ]);

  // คืนค่ากลับไป พร้อมจัดการ BigInt ให้เป็น Number/String
  const stats = {
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
      total: Number(totalRevenue._sum.price || 0),
      thisMonth: Number((currentMonthRevenue as any)._sum.price || 0), // ยอดของเดือนนี้
      monthly: monthlyRevenueHistory,
    },
  };

  // ป้องกัน Error "Do not know how to serialize a BigInt"
  return JSON.parse(
    JSON.stringify(stats, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
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
