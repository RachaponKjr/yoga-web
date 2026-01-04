import { create } from "zustand";
import { authService } from "../service/auth.service";
import type { UserInfoType } from "../types/auth.type";
import Cookies from "js-cookie";
// 1. กำหนดหน้าตาของ User (ปรับตาม T
interface User {
  id: string;
  role: string;
  email: string;
  userInfo: UserInfoType;
}

// 2. กำหนดหน้าตาของ Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // สำคัญมาก เอาไว้บอก ProtectedRoute ว่า "รอก่อน กำลังเช็ค"

  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // --- Initial State ---
  user: null,
  isAuthenticated: false,
  isLoading: true, // เริ่มต้นเป็น true เสมอ เพื่อกันไม่ให้ Route ดีดออกก่อนเช็คเสร็จ

  // --- Actions ---

  // 1. setUser: เอาไว้ใช้ตอน Login สำเร็จ (Set ดื้อๆ)
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  // 2. logout: เคลียร์ทุกอย่าง
  logout: async () => {
    try {
      // เรียก API Logout (บอก Server ว่าฉันออกแล้วนะ)
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // 🔥 ทำใน finally เสมอ เพื่อการันตีว่า local storage ต้องถูกลบ
      localStorage.removeItem("token");

      // ลบ Cookie ด้วย (ถ้าใช้ middleware)
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // 3. checkAuth: พระเอกของเรา ใช้เช็คตอน Refresh หน้าจอ
  checkAuth: async () => {
    set({ isLoading: true }); // เริ่มหมุนติ้วๆ
    try {
      const token = localStorage.getItem("token");
      const cookie = Cookies.get("token");

      // ถ้าไม่มี Token -> จบงาน เป็น Guest
      if (!token && !cookie) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // ถ้ามี Token -> เอาไปถาม Server ว่า Token นี้ของใคร? ยังดีอยู่ไหม?
      const userData = await authService.me(token || cookie); // ต้องแก้ service.me ให้รับ token หรืออ่านจาก header ได้

      if (userData) {
        // Token ดี -> Set User เข้า Store
        set({ user: userData, isAuthenticated: true });
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.error("Session expired or invalid:", error);
      // ถ้า Error (Token หมดอายุ/มั่ว) -> ลบทิ้งแล้วเตะออก
      localStorage.removeItem("token");
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      set({ user: null, isAuthenticated: false });
    } finally {
      // ไม่ว่าจะผ่านหรือไม่ผ่าน -> เลิกหมุน
      set({ isLoading: false });
    }
  },
}));
