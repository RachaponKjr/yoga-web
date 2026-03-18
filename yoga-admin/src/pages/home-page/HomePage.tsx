/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Wallet,
  Activity,
  Clock,
  UserCheck,
  UserIcon,
  Globe,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { adminService } from "@/service/admin.service";
import type { BookingType, CourseType } from "@/types/booking.type";
import { Link } from "react-router-dom";
import type { Round } from "@/types/round.type";
import type { UserType } from "@/types/auth.type";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface StatusType {
  users: { total: number };
  bookings: { total: number };
  classes: { total: number };
  revenue: {
    total: number;
    monthly: Array<{ month: string; amount: number }>;
  };
}

interface CountryStat {
  country: string;
  count: number;
}

interface RoundWithRelation extends Round {
  course: CourseType;
  teacher?: UserType;
  subTeacher?: UserType;
}

const HomePage = () => {
  const [status, setStatus] = useState<StatusType>();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [rounds, setRounds] = useState<RoundWithRelation[]>([]);
  const [countryStats, setCountryStats] = useState<CountryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statusRes, bookingRes, roundsRes, countryRes] =
          await Promise.all([
            adminService.getDashboardStatus(),
            adminService.getBookingLast(),
            adminService.getRoundsAll(),
            adminService.getMonitorCountryStats(),
          ]);

        setStatus(statusRes.data);
        setBookings(bookingRes.data);
        setRounds(roundsRes.data);
        setCountryStats(countryRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: "ยอดจองทั้งหมด",
      value: status?.bookings.total?.toLocaleString() || "0",
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "สมาชิก Active",
      value: status?.users.total?.toLocaleString() || "0",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "รายได้เดือนนี้",
      value: "฿" + (status?.revenue.total?.toLocaleString() || "0"),
      icon: Wallet,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "คลาสทั้งหมด",
      value: status?.classes.total?.toString() || "0",
      icon: Activity,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="bg-gray-50/50 font-sans space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            แดชบอร์ดแอดมิน
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            ยินดีต้อนรับกลับ, สรุปภาพรวมของวันนี้ 👋
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Calendar size={16} className="text-indigo-500" />
          <span className="text-sm font-semibold text-gray-600">
            {format(new Date(), "eeee d MMMM yyyy", { locale: th })}
          </span>
        </div>
      </div>

      {/* 2. Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </span>
                <span className="text-2xl font-black text-gray-800 mt-1">
                  {stat.value}
                </span>
              </div>
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Grid (Middle Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rounds Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" /> ตารางรอบเรียน
            </h2>
            <Link
              to="/classes"
              className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
            >
              ดูทั้งหมด
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 py-4">เวลา/วันที่</th>
                  <th className="px-6 py-4">คลาส</th>
                  <th className="px-6 py-4">ผู้สอน</th>
                  <th className="px-6 py-4 text-center">ความจุ</th>
                  <th className="px-6 py-4 text-right">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rounds.slice(0, 5).map((round, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700">
                        {format(new Date(round.startDateTime), "HH:mm")}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {format(new Date(round.startDateTime), "dd MMM yy")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-800">
                        {round.course?.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] border ${round.subTeacherId ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-gray-50 text-gray-400"}`}
                        >
                          {round.subTeacherId ? (
                            <UserCheck size={14} />
                          ) : (
                            <UserIcon size={14} />
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {round.subTeacherId
                            ? round.subTeacher?.userInfo?.firstName
                            : round.teacher?.userInfo?.firstName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        <Badge
                          variant="outline"
                          className="text-[9px] border-blue-100 text-blue-600"
                        >
                          ON: {round.current_online}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[9px] border-orange-100 text-orange-600"
                        >
                          WK: {round.current_walk_in}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge
                        className={
                          round.status === "Open"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }
                      >
                        {round.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" /> การจองล่าสุด
          </h2>
          <div className="space-y-4 flex-1">
            {bookings.slice(0, 5).map((item, idx) => (
              <div
                key={idx}
                className="flex relative items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-all group"
              >
                <div
                  className={`absolute top-2 right-2 z-10 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                    item.status === "PAID"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : item.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {/* ใส่จุดไฟเล็กๆ ข้างหน้าเพื่อให้ดูมีสถานะจริง */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "PAID"
                          ? "bg-green-500"
                          : item.status === "PENDING"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></span>
                    {item.status}
                  </span>
                </div>
                <img
                  src={`https://api.yogabyniti.com/${item.student.userInfo.avatar}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e: any) =>
                    (e.target.src = `https://ui-avatars.com/api/?name=${item.student.userInfo.firstName}`)
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {item.student.userInfo.firstName}{" "}
                    {item.student.userInfo.lastName}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    จอง: {item.round.course.title}
                  </p>
                </div>
                <div className="text-right text-[10px] mt-4 font-bold text-gray-400 uppercase">
                  {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/bookings"
            className="w-full mt-6 py-3 rounded-2xl hover:text-white! bg-gray-50 text-[11px] font-bold text-gray-500 hover:bg-indigo-600 flex justify-center transition-all uppercase tracking-widest"
          >
            ดูประวัติทั้งหมด
          </Link>
        </div>
      </div>

      {/* 4. Bottom Section: Country Monitor (Long & Detailed) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                สถิติลูกค้าแยกตามประเทศ
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Global Customer Distribution
              </p>
            </div>
          </div>
        </div>

        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6">
            {countryStats.map((item, idx) => {
              const total = status?.users.total || 1;
              const percent = (item.count / total) * 100;

              return (
                <div key={idx} className="flex flex-col space-y-2 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                        <MapPin size={20} className="text-gray-400" />
                      </span>
                      <div>
                        <span className="text-sm font-bold text-gray-700">
                          {item.country}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          <span className="text-[10px] text-gray-400 font-medium tracking-tight">
                            Active Members
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-gray-900">
                        {item.count.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold ml-1">
                        USERS
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between hidden">
                      {/* Hidden label for accessibility if needed */}
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100">
                      <div
                        style={{ width: `${percent}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000 group-hover:bg-indigo-600"
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        Market Share
                      </span>
                      <span className="text-[10px] font-bold text-indigo-500">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {countryStats.length === 0 && !loading && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400 italic">
                ไม่มีข้อมูลสถิติประเทศในขณะนี้
              </p>
            </div>
          )}
        </div>

        {/* Footer ของ Monitor Card */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
          <p className="text-[10px] text-gray-400 font-medium">
            ข้อมูลอัปเดตล่าสุด: {format(new Date(), "HH:mm")} น.
          </p>
          <Link
            to="/users"
            className="text-[10px] font-bold text-indigo-600 hover:underline"
          >
            จัดการรายชื่อสมาชิกทั้งหมด →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
