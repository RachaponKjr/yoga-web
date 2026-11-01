import z from "zod";

export const RoundSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  startDateTime: z.string().min(1, "Please enter a start time"),
  endDateTime: z.string().min(1, "Please enter an end time"),
  // ใช้ coerce เพื่อแปลง string จาก input เป็น number อัตโนมัติ
  max_online: z.coerce.number().min(0, "The quantity cannot be negative"),
  max_walk_in: z.coerce.number().min(0, "The quantity cannot be negative"),
  description: z.string().min(1, "Please enter the details").optional(),
  teacherId: z.string().min(1, "Please select an instructor").optional(),
});

export type Round = z.infer<typeof RoundSchema>;
