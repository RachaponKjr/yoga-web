import { z } from "zod";

// --- 1. Common / Enums (ค่าคงที่ต่างๆ) ---
// กำหนด Enum ไว้เพื่อความแม่นยำและป้องกันการพิมพ์ผิด
export const RoleSchema = z.enum(["Admin", "Instructor", "User"]);
export const BookingTypeSchema = z.enum(["ONLINE", "WALK_IN"]);
export const BookingStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "CANCELLED",
  "FAILED",
]);
export const RoundStatusSchema = z.enum(["Open", "Closed", "Full", "Finished"]);

// --- 2. Student / User Schema ---
// สำหรับจัดการข้อมูลผู้เรียน/ผู้ใช้
export const StudentSchema = z.object({
  id: z.string(),
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  // password: z.string(), // *ปกติไม่ควรส่ง password กลับมาหน้าบ้าน แต่ถ้า API ส่งมาก็ใส่ไว้ได้ครับ
  role: RoleSchema,
  createdAt: z.coerce.date(), // แปลง string ISO เป็น Date object อัตโนมัติ
  updatedAt: z.coerce.date(),
});

// --- 3. Round Schema ---
// สำหรับจัดการข้อมูลรอบเรียน
export const RoundSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  max_online: z.number().int().min(0),
  max_walk_in: z.number().int().min(0),
  current_online: z.number().int().min(0),
  current_walk_in: z.number().int().min(0),
  status: RoundStatusSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// --- 4. Booking Schema (Main) ---
// Schema หลักที่รวมเอา Student และ Round เข้ามาด้วย
export const BookingSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  price: z.number().min(0), // ราคาต้องไม่ติดลบ
  roundId: z.string(),
  type: BookingTypeSchema,
  status: BookingStatusSchema,
  paidAt: z.coerce.date().nullable(), // อนุญาตให้เป็น null ได้
  paymentId: z.string().nullable(), // อนุญาตให้เป็น null ได้
  createdAt: z.coerce.date(),

  // นำ Schema ส่วนย่อยมาประกอบร่าง (Nested Objects)
  round: RoundSchema,
  student: StudentSchema,
});

// --- 5. Export Types (Auto-generated TypeScript Types) ---
// ไม่ต้องเขียน Interface เอง Zod จัดการให้
export type StudentType = z.infer<typeof StudentSchema>;
export type RoundType = z.infer<typeof RoundSchema>;
export type BookingType = z.infer<typeof BookingSchema>;
