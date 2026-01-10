import z from "zod";

export const TeacherSchema = z.object({
  userInfo: z.object({
    avatar: z.string().nullable(),
    experience: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    phone: z.string().nullable(),
    sex: z.string().nullable(),
  }),
});

export const CourseSchema = z.object({
  id: z.string(),
  cover_image: z.string(),
  discount_price: z.number(),
  description: z.string(),
  images: z.array(z.string()),
  price: z.number(),
  title: z.string(),
  status: z.string(),
  teacher: TeacherSchema,
});

export const RoundCourseSchema = z.object({
  course: CourseSchema,
  courseId: z.string(),
  current_online: z.number(),
  current_walk_in: z.number(),
  max_online: z.number(),
  endDateTime: z.string(),
  startDateTime: z.string(),
  max_walk_in: z.number(),
  status: z.string(),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().min(1, "กรุณากรอกรายละเอียด").optional(),
  teacherId: z.string().min(1, "กรุณาเลือกครู").optional(),
});

export const PaginationSchema = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type CourseType = z.infer<typeof CourseSchema>;
export type RoundCourseType = z.infer<typeof RoundCourseSchema>;
export type PaginationType = z.infer<typeof PaginationSchema>;
