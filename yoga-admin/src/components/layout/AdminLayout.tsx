import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, ChevronRight, Flower2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import Sidebar from "./Sidebar";
import { navigation } from "./navigation";
import "./dashboard.css";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const current = navigation.find(item => item.path === pathname);
  return <div className="studio-shell">
    <a href="#admin-content" className="studio-skip">ข้ามไปเนื้อหา</a>
    <aside className="studio-desktop-sidebar"><Sidebar /></aside>
    <div className="studio-workspace">
      <header className="studio-topbar">
        <div className="studio-breadcrumb"><Dialog open={mobileOpen} onOpenChange={setMobileOpen}><DialogTrigger asChild><button className="studio-menu-button" aria-label="เปิดเมนูหลัก"><Menu size={22} /></button></DialogTrigger><DialogContent className="studio-mobile-drawer"><DialogTitle className="sr-only">เมนูจัดการสตูดิโอ</DialogTitle><DialogDescription className="sr-only">เลือกหน้าที่ต้องการจัดการ</DialogDescription><Sidebar onNavigate={() => setMobileOpen(false)} /></DialogContent></Dialog><span>พื้นที่ผู้ดูแล</span><ChevronRight size={14} /><strong>{current?.label || "จัดการสตูดิโอ"}</strong></div>
        <span className="studio-topbar-brand"><Flower2 size={16} /> Yoga by Niti</span>
      </header>
      <main id="admin-content" tabIndex={-1} className="studio-content"><Outlet /></main>
      <footer className="studio-footer"><span>Yoga by Niti · พื้นที่จัดการสตูดิโอ</span><span>ดูแลทุกคลาส ด้วยความใส่ใจ</span></footer>
    </div>
  </div>;
}
