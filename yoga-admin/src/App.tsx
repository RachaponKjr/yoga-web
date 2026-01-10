import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home-page/HomePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// import UnauthorizedPage from "./pages/unauthorized-page/UnauthorizedPage";
import SignInPage from "./pages/sign-in-page/SignInPage";
import AdminLayout from "./components/layout/AdminLayout";
import BookingPage from "./pages/book-page/BookingPage";
import UserPage from "./pages/user-page/UserPage";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
function App() {
  const { isLoading, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes (ใครก็เข้าได้) */}
          <Route path="/signin" element={<SignInPage />} />
          {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

          {/* 🛡️ Admin Routes: ต้อง Login + เป็น ADMIN เท่านั้น */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route element={<AdminLayout />}>
              {/* หน้าเว็บต่างๆ ที่อยากให้มี Sidebar ใส่ในนี้ให้หมด */}
              <Route path="/" element={<HomePage />} />
              <Route path="/bookings" element={<BookingPage />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/settings" element={<div>Settings Page</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
