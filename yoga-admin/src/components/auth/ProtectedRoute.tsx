import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles?: string[]; // รับ role ที่อนุญาตให้เข้าได้ (เป็น Array)
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  // 2. ถ้ายังไม่ Login ให้ไปหน้า Sign In
  if (!isAuthenticated || user === null) {
    // แนบ callbackUrl ไปด้วยเพื่อให้ Login เสร็จแล้วเด้งกลับมาหน้านี้
    return <Navigate to="/signin" replace />;
  }

  // 3. ถ้ามีการระบุ Role และ Role ของ User ไม่อยู่ในรายการที่อนุญาต
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // ดีดกลับไปหน้าแรก หรือหน้า Unauthorized
    return <Navigate to="/" replace />;
  }

  // 4. ถ้าผ่านทุกด่าน ให้แสดงเนื้อหาข้างใน (Outlet คือลูกของ Route นี้)
  return <Outlet />;
};

export default ProtectedRoute;
