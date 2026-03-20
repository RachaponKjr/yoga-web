import http from "@/lib/http";

export const videoService = {
  create: async (payload: {
    url_1: string;
    url_2: string;
    url_3: string;
    url_4: string;
  }) => {
    // ส่ง payload ไปตรงๆ ตามที่ Controller รอรับ { url_1, url_2, ... }
    const response = await http.post("/video/create", payload);
    return response.data;
  },

  getAll: async () => {
    const response = await http.get("/video/get");
    return response.data.data;
  },

  update: async (payload: {
    id: string;
    url_1: string;
    url_2: string;
    url_3: string;
    url_4: string;
  }) => {
    const response = await http.patch("/video/update", payload);
    return response.data;
  },
};
