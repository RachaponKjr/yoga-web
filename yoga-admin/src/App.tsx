import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home-page/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
// import UnauthorizedPage from "./pages/unauthorized-page/UnauthorizedPage";
import SignInPage from "./pages/sign-in-page/SignInPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes (ใครก็เข้าได้) */}
          <Route path="/signin" element={<SignInPage />} />
          {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

          {/* 🛡️ Admin Routes: ต้อง Login + เป็น ADMIN เท่านั้น */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            {/* HomePage ของคุณ ถ้าอยากให้เข้าได้เฉพาะ Admin ก็ใส่ตรงนี้ */}
            <Route path="/" element={<HomePage />} />

            {/* ตัวอย่างหน้าอื่นๆ ของ Admin */}
            <Route path="/dashboard" element={<div>Admin Dashboard</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
