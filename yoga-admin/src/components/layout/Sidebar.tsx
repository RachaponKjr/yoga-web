import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  LogOut,
  Flower,
  ChevronLeft,
  ChevronRight,
  BookIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [expanded, setExpanded] = useState(true); // State ควบคุมการหุบ/ขยาย

  const menuItems = [
    { name: "หน้าแรก", path: "/", icon: Home },
    { name: "การจอง", path: "/bookings", icon: BookIcon },
    { name: "จัดการคลาส", path: "/classes", icon: BookIcon },
    { name: "จัดการสมาชิก", path: "/users", icon: Users },
  ];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <aside className="h-screen">
      <nav
        className={`h-full flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
          expanded ? "w-64" : "w-20"
        }`}
      >
        {/* 1. Header & Toggle */}
        <div className="p-4 pb-2 flex justify-between items-center relative">
          <div
            className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
              expanded ? "w-64" : "w-0"
            }`}
          >
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-indigo-100 shadow-md">
              <Flower size={20} />
            </div>
            <div
              className={`flex flex-col overflow-hidden transition-opacity duration-300 ${
                expanded ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="font-bold text-gray-800 text-lg whitespace-nowrap">
                YogaAdmin
              </span>
            </div>
          </div>

          {/* ปุ่มหุบ/ขยาย */}
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className={`p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer text-gray-600 transition-all absolute ${
              expanded ? "right-4" : "left-1/2 -translate-x-1/2 top-6"
            }`}
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* 2. Menu Items */}
        <ul className="flex-1 px-3 mt-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    relative flex items-center py-3 px-3 rounded-lg font-medium cursor-pointer transition-colors group
                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-gray-50 text-gray-500 hover:text-gray-800"
                    }
                  `}
                >
                  <item.icon
                    size={22}
                    className={`min-w-[22px] transition-all ${
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />

                  <span
                    className={`overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ${
                      expanded ? "w-40 ml-3 opacity-100" : "w-0 ml-0 opacity-0"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Tooltip (แสดงเฉพาะตอนหุบ) */}
                  {!expanded && (
                    <div
                      className={`
                      absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm
                      invisible opacity-0 -translate-x-3 transition-all
                      group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                      z-20 whitespace-nowrap shadow-sm
                    `}
                    >
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 3. Footer (User & Logout) */}
        <div className="border-t border-gray-100 p-3">
          <div
            className={`
              flex items-center p-2 rounded-xl transition-all duration-300
              ${expanded ? "bg-gray-50" : "justify-center"}
            `}
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover border border-white shadow-sm"
            />

            <div
              className={`flex justify-between items-center overflow-hidden transition-all duration-300 ${
                expanded ? "w-40 ml-3" : "w-0 ml-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold text-sm text-gray-700 whitespace-nowrap max-w-[100px]">
                  {user?.email}
                </h4>
                <span className="text-xs text-gray-500">{user?.role}</span>
              </div>

              {/* ปุ่ม Logout แบบ Minimal */}
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md cursor-pointer hover:bg-white hover:text-red-500 text-gray-400 transition-colors shadow-sm"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* กรณีหุบ Sidebar ให้แสดงปุ่ม Logout แยกออกมาด้านล่าง avatar */}
          {!expanded && (
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex justify-center items-center p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
