import z from "zod";

export const AuthSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

export const UserInforSchema = z.object({
  avatar: z.string().nullable(),
  firstName: z.string().nullable(),
  sex: z.string().nullable(),
  country: z.string().nullable(),
  lastName: z.string().nullable(),
  phone_number: z.string().nullable(),
  experience: z.string().nullable(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  twitter: z.string().nullable(),
});

export type AuthType = z.infer<typeof AuthSchema>;
export type UserType = z.infer<typeof UserSchema>;
export type UserInfoType = z.infer<typeof UserInforSchema>;
