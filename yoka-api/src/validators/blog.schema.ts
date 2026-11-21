import { z } from "zod";

export const blogSchema = z.object({
  seoTitle: z.string().trim().max(180).default(""),
  seoDescription: z.string().trim().max(500).default(""),
  seoKeywords: z.string().trim().max(500).default(""),
  canonicalUrl: z.string().trim().max(2000).refine(value => {
    if (!value) return true;
    try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
  }, "กรุณาใส่ URL แบบ http หรือ https").default(""),
  noIndex: z.boolean().default(false),
  coverAlt: z.string().trim().max(300).default(""),
  author: z.string().trim().max(120).default("Yoga By Niti"),
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
  status: z.enum(["all", "published", "draft"]).default("all"),
  sort: z.enum(["recent", "popular"]).default("recent"),
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  search: z.string().trim().max(100).default(""),
});
