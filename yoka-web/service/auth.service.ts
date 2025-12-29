import http from "@/lib/http";
import { AuthType, UserInfoType } from "@/types/auth.type";

export interface InstructorType {
  data: {
    data: {
      id: string;
      role: string;
      email: string;
      userInfo: UserInfoType;
    }[];
  };
}

export const authService = {
  register: async (payload: AuthType) => {
    const response = await http.post("/auth/register", payload);
    return response.data;
  },

  login: async (payload: AuthType) => {
    const response = await http.post("/auth/login", payload);
    return response.data;
  },

  me: async (token?: string) => {
    const response = await http.get("/auth/me", {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: true,
    });
    return response.data;
  },

  getInstructor: async () => {
    const response = await http.get("/auth/get-instructor");
    return response.data.data;
  },

  updateProfile: async (payload: FormData) => {
    const response = await http.patch("/auth/update-profile", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  logout: async () => {
    const response = await http.post("/auth/logout");
    return response.data;
  },
};
