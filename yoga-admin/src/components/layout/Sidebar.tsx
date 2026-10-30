import { NavLink } from "react-router-dom";
import { Flower2, ArrowUpRight, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { navigation } from "./navigation";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuthStore();
  const [leaving, setLeaving] = useState(false);
  const name = user?.userInfo?.firstName || user?.email || "ผู้ดูแลระบบ";
  return <div className="studio-sidebar">
    <NavLink to="/" onClick={onNavigate} className="studio-brand"><span className="studio-brand-mark"><Flower2 size={26} strokeWidth={1.4} /></span><span>yoga by niti<small>STUDIO MANAGEMENT</small></span></NavLink>
    <nav aria-label="เมนูหลัก" className="studio-nav">
      {["สตูดิโอ", "เนื้อหาเว็บไซต์"].map(group => <div key={group} className="studio-nav-group"><p>{group}</p>{navigation.filter(item => item.group === group).map(item => <NavLink key={item.path} to={item.path} end={item.path === "/"} onClick={onNavigate} className={({ isActive }) => `studio-nav-link ${isActive ? "is-active" : ""}`}><item.icon size={19} strokeWidth={1.7} /><span>{item.label}</span></NavLink>)}</div>)}
    </nav>
    <a href="https://yogabyniti.com" target="_blank" rel="noopener noreferrer" className="studio-website"><Flower2 size={24} /><strong>หน้าบ้านของสตูดิโอ<small>เปิดเว็บไซต์ Yoga by Niti</small></strong><ArrowUpRight size={17} /></a>
    <div className="studio-account"><span className="studio-avatar">{name.slice(0, 1).toUpperCase()}</span><div><strong title={name}>{name}</strong><small>ผู้ดูแลระบบ</small></div><button aria-label="ออกจากระบบ" title="ออกจากระบบ" disabled={leaving} onClick={async () => { setLeaving(true); try { await logout(); } finally { setLeaving(false); } }}><LogOut size={18} /></button></div>
  </div>;
}
