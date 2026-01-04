import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // import sidebar ที่เพิ่งสร้าง

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* ส่วน Sidebar (Fixed) */}
      <Sidebar />

      {/* ส่วน Content (Scroll ได้) */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* <Outlet /> คือจุดที่จะแสดง HomePage, Dashboard ฯลฯ */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
