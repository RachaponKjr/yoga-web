import { z } from "zod";

// ==========================================
// 1. ENUMS (ค่าคงที่ต่างๆ)
// ==========================================
export const RoleEnum = z.enum(["Admin", "Instructor", "User"]);
export const SexEnum = z.enum(["Male", "Female", "Other"]); // เดาว่ามี Other ด้วย
export const BookingTypeEnum = z.enum(["ONLINE", "WALK_IN"]);
export const BookingStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "CANCELLED",
  "FAILED",
]);
export const RoundStatusEnum = z.enum(["Open", "Closed", "Full", "Finished"]);
export const CourseStatusEnum = z.enum(["Draft", "Published", "Archived"]);

// ==========================================
// 2. USER DOMAIN (UserInfo & Student)
// ==========================================

// 2.1 ข้อมูลส่วนตัว (UserInfo)
export const UserInfoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  avatar: z.string().nullable().optional(), // รูปอาจจะไม่มี
  sex: SexEnum.or(z.string()), // ใช้ .or(z.string()) กันเหนียวเผื่อ DB เก็บค่าแปลกๆ
  firstName: z.string(),
  lastName: z.string(),
  phone_number: z.string().nullable(),
  country: z.string().nullable(),
  experience: z.string().nullable().optional(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  twitter: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// 2.2 ข้อมูลบัญชีผู้ใช้ (Student/User)
export const StudentSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  // password: z.string(), // *ปกติไม่ควร Validate password ขากลับ ถ้า API ส่งมาแล้วไม่ได้ใช้ ให้ comment ออกหรือปล่อยไว้ก็ได้ครับ
  role: RoleEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),

  // 🔥 Relation: เชื่อม UserInfo เข้ามา
  userInfo: UserInfoSchema,
});

// ==========================================
// 3. COURSE DOMAIN
// ==========================================
export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  price: z.number().min(0),
  discount_price: z.number().min(0).optional().nullable(),
  cover_image: z.string().nullable().optional(),
  images: z.array(z.string()).default([]), // Array ของรูปภาพ
  status: CourseStatusEnum.or(z.string()),
  teacherId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// ==========================================
// 4. ROUND DOMAIN (รอบเรียน)
// ==========================================
export const RoundSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),

  // จำนวนที่นั่ง
  max_online: z.number().int().min(0),
  max_walk_in: z.number().int().min(0),
  current_online: z.number().int().min(0),
  current_walk_in: z.number().int().min(0),
  description: z.string().min(1, "กรุณากรอกรายละเอียด").optional(),
  teacherId: z.string().min(1, "กรุณาเลือกครู").optional(),
  status: RoundStatusEnum.or(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),

  // 🔥 Relation: เชื่อม Course เข้ามา
  course: CourseSchema,
});

// ==========================================
// 5. BOOKING DOMAIN (การจอง - ตัวหลักสุด)
// ==========================================
export const BookingSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  price: z.number(),
  roundId: z.string(),
  type: BookingTypeEnum,
  status: BookingStatusEnum,
  description: z.string().min(1, "กรุณากรอกรายละเอียด").optional(),
  courseId: z.string(),

  paidAt: z.coerce.date().nullable(), // อนุญาตให้เป็น null
  paymentId: z.string().nullable(), // อนุญาตให้เป็น null
  createdAt: z.coerce.date(),

  // 🔥 Relation 1: รอบเรียน (ซึ่งมีคอร์สข้างใน)
  round: RoundSchema,

  // 🔥 Relation 2: นักเรียน (ซึ่งมี UserInfo ข้างใน)
  student: StudentSchema,
});

// ==========================================
// 6. EXPORT TYPES (TS Types)
// ==========================================
export type UserInfoType = z.infer<typeof UserInfoSchema>;
export type StudentType = z.infer<typeof StudentSchema>;
export type CourseType = z.infer<typeof CourseSchema>;
export type RoundType = z.infer<typeof RoundSchema>;
export type BookingType = z.infer<typeof BookingSchema>;
