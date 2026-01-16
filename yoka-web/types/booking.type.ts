import z from "zod";
import { CourseSchema, RoundCourseSchema } from "./course.type";

export const BookingSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  email: z.string().nullable(),
  quantity: z.number(),
  price: z.number(),
  roundId: z.string(),
  type: z.enum(["ONLINE", "WALK_IN"]),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
  paidAt: z.string().nullable(),
  paymentId: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.string(),
  round: RoundCourseSchema,
});

export type BookingType = z.infer<typeof BookingSchema>;
