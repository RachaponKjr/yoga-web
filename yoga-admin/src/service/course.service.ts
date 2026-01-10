import http from "@/lib/http";
import type { RoundType } from "@/types/booking.type";

export const courseService = {
  // รับ config เพิ่มเติม (เผื่อส่ง Cookie จาก Server)
  getAll: async (headers = {}) => {
    const response = await http.get("/course/rounds", {
      params: {
        page: 1,
        limit: 10,
      },
      headers: { ...headers }, // แนบ Header ที่ส่งเข้ามา (เช่น Cookie)
    });
    return response.data;
  },

  getCourseById: async (courseId: string) => {
    const response = await http.get(`/course/course/${courseId}`);
    return response.data;
  },

  getCourseAll: async () => {
    const response = await http.get(`/course/all`, {
      params: {
        page: 1,
        limit: 10,
      },
    });
    return response.data;
  },

  getRoundToDay: async ({
    today,
    month,
  }: {
    today?: string;
    month?: string;
  }) => {
    const response = await http.get("/course/round-today-or-month", {
      params: {
        today,
        month,
      },
    });
    return response.data;
  },

  getMyCourse: async (userId: string, page: number) => {
    const response = await http.get(`/course/my-course/${userId}`, {
      params: {
        page,
        limit: 10,
      },
    });

    return response.data;
  },

  createCourse: async (course: FormData) => {
    const response = await http.post("/course/create", course, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  createRound: async (round: RoundType) => {
    const response = await http.post("/course/set-round", round);
    return response.data;
  },

  getMyRound: async () => {
    const response = await http.get(`/course/round-my-round`);
    return response.data;
  },

  deleteCourse: async (courseId: string) => {
    const response = await http.delete(`/course/delete/${courseId}`);
    return response.data;
  },
};
