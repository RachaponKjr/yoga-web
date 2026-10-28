import { Router } from "express";
import { Prisma } from "@prisma/client";
import multer from "multer";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import prisma from "../config/prisma";
import { authMiddleware, restrictTo } from "../middlewares/auth.middleware";
import { AppError } from "../utils/AppError";
import { blogSchema, blogQuerySchema } from "../validators/blog.schema";

const router = Router();
const admin = [authMiddleware, restrictTo("Admin")];
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

function databaseError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") throw new AppError("URL บทความนี้ถูกใช้แล้ว กรุณาเปลี่ยน slug", 409);
    if (error.code === "P2025") throw new AppError("ไม่พบบทความ", 404);
  }
  throw error;
}

async function list(query: unknown, includeDrafts: boolean) {
  const { page, limit, search } = blogQuerySchema.parse(query);
  const where: Prisma.BlogPostWhereInput = {
    ...(includeDrafts ? {} : { published: true }),
    ...(search ? { OR: [{ title: { contains: search, mode: "insensitive" } }, { excerpt: { contains: search, mode: "insensitive" } }] } : {}),
  };
  const [data, total] = await prisma.$transaction([
    prisma.blogPost.findMany({ where, skip: (page - 1) * limit, take: limit,
      orderBy: includeDrafts ? [{ updatedAt: "desc" }, { id: "desc" }] : [{ publishedAt: "desc" }, { id: "desc" }],
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, published: true, publishedAt: true, createdAt: true, updatedAt: true },
    }),
    prisma.blogPost.count({ where }),
  ]);
  return { success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

router.get("/", async (req, res) => { res.json(await list(req.query, false)); });
router.get("/admin", ...admin, async (req, res) => { res.json(await list(req.query, true)); });
router.get("/admin/:id", ...admin, async (req, res) => {
  const data = await prisma.blogPost.findUnique({ where: { id: String(req.params.id) } });
  if (!data) throw new AppError("ไม่พบบทความ", 404);
  res.json({ success: true, data });
});
router.post("/upload", ...admin, (req, res, next) => {
  upload.single("image")(req, res, error => {
    if (error) return next(new AppError(error.code === "LIMIT_FILE_SIZE" ? "รูปภาพต้องไม่เกิน 5 MB" : "อัปโหลดรูปภาพไม่สำเร็จ", 400));
    next();
  });
}, async (req, res) => {
  const buffer = req.file?.buffer;
  if (!buffer) throw new AppError("กรุณาเลือกรูปภาพ", 400);
  const extension = buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ? "jpg"
    : buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? "png"
    : buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" ? "webp" : null;
  if (!extension) throw new AppError("รองรับเฉพาะ JPG, PNG และ WebP", 400);
  const filename = `${randomUUID()}.${extension}`;
  const directory = path.join(process.cwd(), "uploads", "blog");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), buffer);
  res.status(201).json({ success: true, data: { url: `/uploads/blog/${filename}` } });
});
router.post("/", ...admin, async (req, res) => {
  const payload = blogSchema.parse(req.body);
  try {
    const data = await prisma.blogPost.create({ data: { ...payload, publishedAt: payload.published ? new Date() : null } });
    res.status(201).json({ success: true, data });
  } catch (error) { databaseError(error); }
});
router.put("/:id", ...admin, async (req, res) => {
  const payload = blogSchema.parse(req.body);
  const id = String(req.params.id);
  try {
    const data = await prisma.$transaction(async tx => {
      const existing = await tx.blogPost.findUnique({ where: { id } });
      if (!existing) throw new AppError("ไม่พบบทความ", 404);
      return tx.blogPost.update({ where: { id }, data: { ...payload, publishedAt: payload.published ? existing.publishedAt ?? new Date() : null } });
    });
    res.json({ success: true, data });
  } catch (error) { databaseError(error); }
});
router.delete("/:id", ...admin, async (req, res) => {
  try { await prisma.blogPost.delete({ where: { id: String(req.params.id) } }); res.status(204).send(); }
  catch (error) { databaseError(error); }
});
router.get("/:slug", async (req, res) => {
  const data = await prisma.blogPost.findFirst({ where: { slug: String(req.params.slug), published: true } });
  if (!data) throw new AppError("ไม่พบบทความ", 404);
  res.json({ success: true, data });
});

export default router;
