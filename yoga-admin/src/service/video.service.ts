import http from "@/lib/http";

export interface VideoContent {
  id: string;
  url_1: string | null;
  url_2: string | null;
  url_3: string | null;
  url_4: string | null;
  url_5: string | null;
}
const uploadConfig = { headers: { "Content-Type": "multipart/form-data" }, timeout: 60000 };
export const videoService = {
  create: async (payload: FormData): Promise<VideoContent> =>
    (await http.post("/video/create", payload, uploadConfig)).data.data,
  getAll: async (): Promise<VideoContent | null> => (await http.get("/video/get")).data.data,
  update: async (payload: FormData): Promise<VideoContent> =>
    (await http.patch("/video/update", payload, uploadConfig)).data.data,
};
