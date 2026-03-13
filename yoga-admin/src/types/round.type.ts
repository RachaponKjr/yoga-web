import z from "zod";

export const RoundSchema = z.object({
  id: z.string().optional(),
  courseId: z.string().min(1, "กรุณาเลือกคอร์ส"),
  startDateTime: z.string().min(1, "ระบุเวลาเริ่ม"),
  endDateTime: z.string().min(1, "ระบุเวลาเลิก"),
  // ใช้ coerce เพื่อแปลง string จาก input เป็น number อัตโนมัติ
  max_online: z.coerce.number().min(0, "จำนวนต้องไม่ติดลบ"),
  current_online: z.coerce.number().min(0, "จำนวนต้องไม่ติดลบ"),
  current_walk_in: z.coerce.number().min(0, "จำนวนต้องไม่ติดลบ"),
  subTeacherId: z.string().min(1, "กรุณาเลือกครู").optional(),
  about: z.string().optional(),
  max_walk_in: z.coerce.number().min(0, "จำนวนต้องไม่ติดลบ"),
  description: z.string().min(1, "กรุณากรอกรายละเอียด").optional(),
  status: z.string().min(1, "กรุณาเลือกสถานะ").optional(),
  teacherId: z.string().min(1, "กรุณาเลือกครู").optional(),
});

export type Round = z.infer<typeof RoundSchema>;
