import { LayoutDashboard, CalendarDays, BookOpen, Ticket, Users, Clapperboard, FileText } from "lucide-react";
export const navigation = [
  { label: "ภาพรวม", path: "/", icon: LayoutDashboard, group: "สตูดิโอ" },
  { label: "การจอง", path: "/bookings", icon: CalendarDays, group: "สตูดิโอ" },
  { label: "คลาสและรอบเรียน", path: "/classes", icon: BookOpen, group: "สตูดิโอ" },
  { label: "สมาชิก", path: "/users", icon: Users, group: "สตูดิโอ" },
  { label: "คูปองส่วนลด", path: "/coupons", icon: Ticket, group: "สตูดิโอ" },
  { label: "วิดีโอและตารางเรียน", path: "/video", icon: Clapperboard, group: "เนื้อหาเว็บไซต์" },
  { label: "บทความ", path: "/blog", icon: FileText, group: "เนื้อหาเว็บไซต์" },
];
