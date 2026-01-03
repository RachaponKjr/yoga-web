import z from "zod";

export const RoundSchema = z.object({
  courseId: z.string().min(1, "กรุณาเลือกคอร์ส"),
  startDateTime: z.string().min(1, "ระบุเวลาเริ่ม"),
  endDateTime: z.string().min(1, "ระบุเวลาเลิก"),
  // ใช้ coerce เพื่อแปลง string จาก input เป็น number อัตโนมัติ
  max_online: z.coerce.number().min(0, "จำนวนต้องไม่ติดลบ"),
  max_walk_in: z.coerce.number().min(0, "จำนวนต้องไม่ติดลบ"),
});

export type Round = z.infer<typeof RoundSchema>;
