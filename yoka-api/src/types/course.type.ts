import z from "zod";

export const CourseYogaSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.number().min(1),
  discount_price: z.number().optional(),
  cover_image: z.string().optional(),
  about: z.string().optional(),
  images: z.string().array().optional(),
  teacherId: z.string(),
});

export const CourseRoundSchema = z.object({
  courseId: z.string(),
  startDateTime: z.coerce.date().default(new Date()),
  endDateTime: z.coerce.date().default(new Date()),
  max_online: z.coerce.number().default(0),
  max_walk_in: z.coerce.number().default(0),
  current_online: z.coerce.number().default(0),
  current_walk_in: z.coerce.number().default(0),
  teacherId: z.string().nullable().optional(),
  subTeacherId: z.string().nullable().optional(),
  about: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["Draft", "Open", "Full", "Closed"]).default("Draft"),
});

export type CourseYogaType = z.infer<typeof CourseYogaSchema>;
export type CourseRoundType = z.infer<typeof CourseRoundSchema>;
