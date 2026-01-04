import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react"; // หรือ Icon loading ที่คุณใช้
import { useAuthStore } from "../../stores/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles?: string[]; // รับ role ที่อนุญาตให้เข้าได้ (เป็น Array)
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  console.log(user);
  // 1. ถ้ากำลังเช็ค Token อยู่ ให้หมุนรอก่อน (สำคัญมาก ไม่งั้นจะโดนดีดออกตอน Refresh)
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. ถ้ายังไม่ Login ให้ไปหน้า Sign In
  if (!isAuthenticated || !user) {
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
