import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับสร้าง (หรือจะใช้ upsert เพื่อไม่ให้ข้อมูลซ้ำซ้อนหลายแถวก็ได้)
export const createVideoService = async ({
  payload,
}: {
  payload: {
    url_1: string;
    url_2: string;
    url_3: string;
    url_4: string;
  };
}) => {
  // แนะนำ: ลบข้อมูลเก่าทิ้งก่อน หรือจะเก็บประวัติไว้ก็ได้
  // ในที่นี้คือสร้างใหม่เลยตามที่คุณเขียนมา
  return await prisma.videoPerview.create({
    data: payload,
  });
};

// ฟังก์ชันสำหรับดึงข้อมูลล่าสุด 1 ชุด
export const getVideoService = async () => {
  return await prisma.videoPerview.findFirst({
    orderBy: {
      id: "desc", // ดึงอันที่เพิ่งสร้างล่าสุด
    },
  });
};

export const updateVideoService = async ({
  payload,
}: {
  payload: {
    id: string;
    url_1: string;
    url_2: string;
    url_3: string;
    url_4: string;
    coverImage: string;
  };
}) => {
  return await prisma.videoPerview.update({
    where: {
      id: payload.id,
    },
    data: {
      url_1: payload.url_1,
      url_2: payload.url_2,
      url_3: payload.url_3,
      url_4: payload.url_4,
      url_5: payload.coverImage,
    },
  });
};
