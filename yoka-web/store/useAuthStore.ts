import { UserInfoType } from "@/types/auth.type";
import { create } from "zustand";

interface User {
  id: string;
  role: string;
  email: string;
  userInfo: UserInfoType;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Action สำหรับ set user เข้าไปดื้อๆ
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // Action logout
  logout: () => set({ user: null, isAuthenticated: false }),
}));
