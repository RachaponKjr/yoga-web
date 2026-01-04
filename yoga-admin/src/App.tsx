import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home-page/HomePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// import UnauthorizedPage from "./pages/unauthorized-page/UnauthorizedPage";
import SignInPage from "./pages/sign-in-page/SignInPage";
import AdminLayout from "./components/layout/AdminLayout";
import BookingPage from "./pages/book-page/BookingPage";
import UserPage from "./pages/user-page/UserPage";
function App() {
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
