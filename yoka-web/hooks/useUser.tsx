import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // หรือ 'next/router' สำหรับ Pages router
import { authService } from "@/service/auth.service";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        // 2. Decode Token เพื่อดูข้อมูลข้างใน
        const checkToken = await authService.me();
        // 3. เช็ควันหมดอายุ (exp คือหน่วยวินาที, Date.now() คือมิลลิวินาที)
        if (checkToken.exp * 1000 < Date.now()) {
          // Token หมดอายุแล้ว
          setIsAuthenticated(false);
          setUser(null);
          router.push("/login"); // เด้งไปหน้า Login ทันที
        } else {
          // Token ยังใช้ได้
          setIsAuthenticated(true);
          //   setUser(checkToken.data); // เก็บข้อมูล User ไว้ใช้งาน (เช่น role, id)
        }
      } catch (error) {
        // Token ผิดรูปแบบ หรือ Corrupt
        setIsAuthenticated(false);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [router]);

  // Return ค่าที่จำเป็นออกไปให้ Component อื่นใช้
  return { isAuthenticated, isLoading, user };
};
