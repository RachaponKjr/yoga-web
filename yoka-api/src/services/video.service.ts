import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface VideoContent {
  url_1?: string;
  url_2?: string;
  url_3?: string;
  url_4?: string;
  url_5?: string | null;
}

export const getVideoService = () => prisma.videoPerview.findFirst({ orderBy: { id: "desc" } });

// The homepage has one content set. Reuse it when a client submits create again.
export const createVideoService = async ({ payload }: { payload: VideoContent }) => {
  const existing = await getVideoService();
  return existing
    ? prisma.videoPerview.update({ where: { id: existing.id }, data: payload })
    : prisma.videoPerview.create({ data: payload });
};

export const updateVideoService = ({ payload }: { payload: VideoContent & { id: string } }) => {
  const { id, ...data } = payload;
  return prisma.videoPerview.update({ where: { id }, data });
};
