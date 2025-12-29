import z from "zod";

export const BookingSchema = z.object({
  studentId: z.string(),
  roundId: z.string(),
  price: z.number(),
  type: z.enum(["ONLINE", "WALK_IN"]),
  paidAt: z.date().optional(),
  paymentId: z.string().optional(),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]).default("PENDING"),
});

export type BookingType = z.infer<typeof BookingSchema>;
