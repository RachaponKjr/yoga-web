import prisma from "../config/prisma";
import { PaymentStatus, Status } from "@prisma/client";

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
      status: PaymentStatus.PAID,
    },
    // 1. เอาแค่ 5 อันล่าสุด
    take: 5,

    // 2. เรียงจากวันที่สร้างล่าสุด (ใหม่ -> เก่า)
    orderBy: {
      createdAt: "desc",
    },

    // 3. Join ตารางเพื่อเอาข้อมูลไปแสดงผล
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
