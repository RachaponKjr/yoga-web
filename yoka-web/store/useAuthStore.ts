import { create } from "zustand";
import { UserInfoType } from "@/types/auth.type";
import { authService } from "@/service/auth.service";

interface User {
  id: string;
  role: string;
  email: string;
  userInfo: UserInfoType;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // เพิ่มตัวนี้: เช็คว่ากำลังโหลดอยู่ไหม

  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>; // เพิ่มตัวนี้: ฟังก์ชันเช็ค token
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // เริ่มต้นเป็น true เพื่อกันไม่ให้หน้าเว็บ render ก่อนเช็คเสร็จ

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  logout: async () => {
    try {
      // พยายามเรียก API Logout (ถ้า Server ต้องเคลียร์ session)
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // 🔥 ย้ายมาทำใน finally เพื่อการันตีว่า "ต้องลบ" เสมอ ไม่ว่า API จะพังหรือไม่
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, isLoading: false });

      // ถ้าใช้ Next.js แล้วอยาก redirect ไปหน้า login ชัวร์ๆ
      // window.location.href = "/login";
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true }); // เริ่มโหลด

      // เรียก API /auth/me
      // เนื่องจาก axios ตั้ง withCredentials: true มันจะส่ง cookie ไปเอง
      // หรือถ้าเก็บ token ใน localStorage ก็ดึงมาส่งตรงนี้ได้
      const userData = await authService.me();

      // ถ้าสำเร็จ set user
      set({ user: userData.data, isAuthenticated: true });
    } catch (error) {
      console.log("Token invalid or expired", error);
      // ถ้า Error (เช่น 401) ให้เคลียร์ user ทิ้ง
      set({ user: null, isAuthenticated: false });
    } finally {
      // ไม่ว่าจะสำเร็จหรือล้มเหลว ก็เลิกโหลด
      set({ isLoading: false });
    }
  },
}));
