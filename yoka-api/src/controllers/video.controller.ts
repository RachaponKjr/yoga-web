import { Request, Response, NextFunction } from "express";
import { mkdir, writeFile, unlink } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { AppError } from "../utils/AppError";
import * as videoService from "../services/video.service";

export const getVideoPreview = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: await videoService.getVideoService() });
  } catch (error) { next(error); }
};

function instagramUrl(value: unknown, field: string): string {
  if (typeof value !== "string") throw new AppError(`${field}: กรุณาระบุลิงก์เป็นข้อความ`, 400);
  if (!value.trim()) return "";
  try {
    const url = new URL(value.trim());
    const match = url.pathname.match(/^\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)\/?(?:embed\/?)?$/);
    if (url.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(url.hostname) || !match || url.port || url.username || url.password) throw new Error();
    const kind = url.pathname.split("/")[1] === "reels" ? "reel" : url.pathname.split("/")[1];
    return `https://www.instagram.com/${kind}/${match[1]}/`;
  } catch { throw new AppError(`${field}: ใช้ลิงก์ Instagram Reel หรือโพสต์ที่เปิดสาธารณะ`, 400); }
}

function imageExtension(file: Express.Multer.File): string {
  const b = file.buffer;
  if (file.mimetype === "image/png" && b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return "png";
  if (file.mimetype === "image/jpeg" && b[0] === 255 && b[1] === 216 && b[2] === 255) return "jpg";
  if (file.mimetype === "image/webp" && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return "webp";
  throw new AppError("กรุณาเลือกภาพ JPG, PNG หรือ WebP ที่ถูกต้อง", 400);
}

const saveVideo = (update: boolean) => async (req: Request, res: Response, next: NextFunction) => {
  let uploadedPath: string | undefined;
  try {
    const body = req.body || {};
    if (update && (typeof body.id !== "string" || !body.id.trim())) throw new AppError("กรุณาระบุ ID ของข้อมูล", 400);
    const payload: videoService.VideoContent = {};
    for (const field of ["url_1", "url_2", "url_3", "url_4"] as const) {
      if (body[field] !== undefined) payload[field] = instagramUrl(body[field], field);
    }
    if (body.remove_image !== undefined && !["true", "false"].includes(body.remove_image)) throw new AppError("remove_image ไม่ถูกต้อง", 400);
    if (body.remove_image === "true" && req.file) throw new AppError("ไม่สามารถลบและอัปโหลดภาพพร้อมกันได้", 400);
    if (!Object.keys(payload).length && !req.file && body.remove_image !== "true") throw new AppError("ไม่มีข้อมูลที่จะบันทึก", 400);
    if (body.remove_image === "true") payload.url_5 = null;
    if (req.file) {
      const extension = imageExtension(req.file);
      const filename = `schedule-${randomUUID()}.${extension}`;
      await mkdir(path.join("uploads", "images"), { recursive: true });
      uploadedPath = path.join("uploads", "images", filename);
      await writeFile(uploadedPath, req.file.buffer);
      payload.url_5 = `/uploads/images/${filename}`;
    }
    const data = update
      ? await videoService.updateVideoService({ payload: { ...payload, id: body.id } })
      : await videoService.createVideoService({ payload });
    res.json({ success: true, data });
  } catch (error) {
    if (uploadedPath) await unlink(uploadedPath).catch(() => undefined);
    if ((error as { code?: string }).code === "P2025") return next(new AppError("ไม่พบข้อมูล กรุณาโหลดหน้าใหม่", 404));
    next(error);
  }
};

export const createVideoPreview = saveVideo(false);
export const updateVideoPreview = saveVideo(true);
