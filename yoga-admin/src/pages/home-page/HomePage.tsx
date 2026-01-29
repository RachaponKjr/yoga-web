import { useEffect, useState } from "react";
import { Users, Calendar, Wallet, Activity, Clock } from "lucide-react";
import { adminService } from "@/service/admin.service";
import type { BookingType } from "@/types/booking.type";
import { Link } from "react-router-dom";

interface StatusType {
  users: {
    total: number;
  };
  bookings: {
    total: number;
  };
  classes: {
    total: number;
  };
  revenue: {
    total: number;
    monthly: Array<{ month: string; amount: number }>;
  };
}

const HomePage = () => {
  const [status, setStatus] = useState<StatusType>();
  const [bookings, setBookings] = useState<BookingType[]>();
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await adminService.getDashboardStatus();
        setStatus(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    const fetchBookings = async () => {
      try {
        const response = await adminService.getBookingLast();
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching booking list:", error);
      }
    };
    fetchStatus();
    fetchBookings();
  }, []);

  // 1. Mockup Data: ข้อมูลตัวอย่างสำหรับแสดงผล
  const stats = [
    {
      label: "ยอดจองทั้งหมด",
      value: status?.bookings.total?.toString() || "0",
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "สมาชิก Active",
      value: status?.users.total?.toString() || "0",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "รายได้เดือนนี้",
      value: "฿" + status?.revenue.total?.toFixed(2) || "0",
      icon: Wallet,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "คลาสวันนี้",
      value: status?.classes.total?.toString() || "0",
      //   sub: "Active Now: 3",
      icon: Activity,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const todaysClasses = [
    {
      time: "08:00",
      name: "Morning Flow Yoga",
      trainer: "K.Somsri",
      spots: "18/20",
      status: "Finished",
    },
    {
      time: "10:00",
      name: "Hatha Yoga Basic",
      trainer: "K.John",
      spots: "15/15",
      status: "Full",
    },
    {
      time: "13:00",
      name: "Pilates Mat",
      trainer: "K.Anne",
      spots: "8/15",
      status: "Active",
    },
    {
      time: "17:30",
      name: "Vinyasa Flow",
      trainer: "K.Somsri",
      spots: "12/20",
      status: "Upcoming",
    },
    {
      time: "19:00",
      name: "Relax & Stretch",
      trainer: "K.May",
      spots: "5/15",
      status: "Upcoming",
    },
  ];

  return (
    <div className=" bg-gray-50/50 font-sans">
      {/* Header Section */}
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">แดชบอร์ด</h1>
          <p className="text-gray-500 text-sm mt-1">
            ยินดีต้อนรับกลับ, คุณแอดมิน 👋
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            📅{" "}
            {new Date().toLocaleDateString("th-TH", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* 2. Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </span>
                {/* {stat.sub && (
                  <span className="text-xs text-orange-500 font-medium mt-1">
                    {stat.sub}
                  </span>
                )} */}
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content: Split Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Today's Schedule (Takes up 2/3 space) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" />
              ตารางคลาสวันนี้
            </h2>
            <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors">
              ดูทั้งหมด
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 pl-2 font-medium">เวลา</th>
                  <th className="pb-3 font-medium">คลาส</th>
                  <th className="pb-3 font-medium">ผู้สอน</th>
                  <th className="pb-3 font-medium text-center">ที่นั่ง</th>
                  <th className="pb-3 font-medium text-right">สถานะ</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {todaysClasses.map((cls, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <td className="py-4 pl-2 font-semibold text-gray-600">
                      {cls.time}
                    </td>
                    <td className="py-4">
                      <span className="block font-bold text-gray-800">
                        {cls.name}
                      </span>
                      <span className="text-xs text-gray-400">Studio A</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 font-bold">
                          {cls.trainer.charAt(2)}
                        </div>
                        <span className="text-gray-600">{cls.trainer}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          cls.spots === "15/15"
                            ? "bg-red-50 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cls.spots}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span
                        className={`
                            inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                            ${
                              cls.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : ""
                            }
                            ${
                              cls.status === "Full"
                                ? "bg-red-100 text-red-700"
                                : ""
                            }
                            ${
                              cls.status === "Upcoming"
                                ? "bg-blue-100 text-blue-700"
                                : ""
                            }
                            ${
                              cls.status === "Finished"
                                ? "bg-gray-100 text-gray-500"
                                : ""
                            }
                        `}
                      >
                        {cls.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Bookings (Takes up 1/3 space) */}
        <div className="bg-white w-full flex flex-col rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">การจองล่าสุด</h2>
          </div>

          <div className="space-y-4">
            {bookings?.slice(0, 3)?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
              >
                <img
                  src={`${"http://119.59.99.141:4001/"}${
                    item.student.userInfo.avatar || ""
                  }`}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {item.student.userInfo.firstName}{" "}
                    {item.student.userInfo.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    จองคลาส{" "}
                    <span className="text-indigo-600 font-medium">
                      {item.round.course.title}
                    </span>
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {String(item.round.startDateTime).split("T")[0]}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/bookings"
            className="w-full flex justify-center items-center cursor-pointer mt-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            ดูประวัติทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
