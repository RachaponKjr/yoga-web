import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ใช้ตัวอักษรอังกฤษตัวเล็ก ตัวเลข และขีดกลาง").refine(value => !["admin", "upload"].includes(value), "slug นี้สงวนไว้ กรุณาใช้ชื่ออื่น"),
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().trim().min(1).max(50000),
  coverImage: z.string().trim().max(2000).refine(value => {
    if (!value || /^\/uploads\/blog\/[a-f0-9-]+\.(jpg|png|webp)$/.test(value)) return true;
    try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; }
    catch { return false; }
  }, "กรุณาใช้ URL รูปภาพแบบ http หรือ https").default(""),
  published: z.boolean().default(false),
});

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  search: z.string().trim().max(100).default(""),
});
