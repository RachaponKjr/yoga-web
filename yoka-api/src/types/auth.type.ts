import z from "zod";

export const RegisterInputSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(["Student", "Instructor"]).default("Student"),
});

export const LoginInputSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const UpdateProfileInputSchema = z.object({
  avatar: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone_number: z.string().optional(),
  sex: z.enum(["Male", "Female"]).optional(),
  experience: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  role: z.enum(["Student", "Instructor", "Admin"]).optional(),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;
