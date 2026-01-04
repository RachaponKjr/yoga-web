import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { bookingService } from "@/service/booking.service";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getAllBooking();
        console.log(response);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  // 1. Mock Data: ข้อมูลจำลองการจอง
  //   const bookings = [
  //     {
  //       id: "BK-001",
  //       user: {
  //         name: "อารยา สวยงาม",
  //         image: "https://i.pravatar.cc/150?u=1",
  //         phone: "081-234-5678",
  //       },
  //       classInfo: { name: "Morning Vinyasa", level: "Intermediate" },
  //       date: "12 ต.ค. 2023",
  //       time: "08:00 - 09:00",
  //       status: "Confirmed", // Confirmed, Pending, Cancelled
  //       price: "฿450",
  //       paymentMethod: "Credit Card",
  //     },
  //     {
  //       id: "BK-002",
  //       user: {
  //         name: "สมชาย ใจดี",
  //         image: "https://i.pravatar.cc/150?u=2",
  //         phone: "089-999-8888",
  //       },
  //       classInfo: { name: "Hatha Yoga Basic", level: "Beginner" },
  //       date: "12 ต.ค. 2023",
  //       time: "10:00 - 11:30",
  //       status: "Pending",
  //       price: "฿350",
  //       paymentMethod: "Transfer",
  //     },
  //     {
  //       id: "BK-003",
  //       user: {
  //         name: "Nancy Johnson",
  //         image: "https://i.pravatar.cc/150?u=3",
  //         phone: "090-555-4444",
  //       },
  //       classInfo: { name: "Pilates Mat", level: "All Levels" },
  //       date: "13 ต.ค. 2023",
  //       time: "17:00 - 18:00",
  //       status: "Cancelled",
  //       price: "฿500",
  //       paymentMethod: "-",
  //     },
  //     {
  //       id: "BK-004",
  //       user: {
  //         name: "เอกชัย มานะ",
  //         image: "https://i.pravatar.cc/150?u=4",
  //         phone: "082-333-2222",
  //       },
  //       classInfo: { name: "Ashtanga Yoga", level: "Advanced" },
  //       date: "13 ต.ค. 2023",
  //       time: "19:00 - 20:30",
  //       status: "Confirmed",
  //       price: "฿450",
  //       paymentMethod: "Cash",
  //     },
  //     {
  //       id: "BK-005",
  //       user: {
  //         name: "วิภาดา รักษ์สุขภาพ",
  //         image: "https://i.pravatar.cc/150?u=5",
  //         phone: "086-777-6666",
  //       },
  //       classInfo: { name: "Morning Vinyasa", level: "Intermediate" },
  //       date: "14 ต.ค. 2023",
  //       time: "08:00 - 09:00",
  //       status: "Confirmed",
  //       price: "฿450",
  //       paymentMethod: "Credit Card",
  //     },
  //   ];

  // Function แปลงสถานะเป็น Badge สวยๆ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
            <CheckCircle size={12} /> ชำระแล้ว
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
            <Clock size={12} /> รอชำระ
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
            <XCircle size={12} /> ยกเลิก
          </span>
        );
      default:
        return <span className="text-gray-500">{status}</span>;
    }
  };

  return (
    <div className=" bg-gray-50/50 min-h-max font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            รายการจอง (Booking List)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            จัดการข้อมูลการจองคลาสทั้งหมด
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={18} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-indigo-600! text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
            + เพิ่มการจอง
          </button>
        </div>
      </div>

      {/* 2. Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar: Search & Filter */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 items-center bg-white">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสมาชิก, คลาส, หรือรหัส..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors">
            <Filter size={18} />
            ตัวกรอง
          </button>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  สมาชิก
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  คลาสที่จอง
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  วัน-เวลา
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
                  สถานะ
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                  ราคา
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  {/* Member Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.user.image}
                        alt={booking.user.name}
                        className="h-10 w-10 rounded-full object-cover border border-gray-100"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {booking.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.user.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Class Column */}
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.classInfo.name}
                      </p>
                      <p className="text-xs text-indigo-500 bg-indigo-50 inline-block px-1.5 rounded mt-0.5">
                        {booking.classInfo.level}
                      </p>
                    </div>
                  </td>

                  {/* Date Column */}
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">
                      <p>{booking.date}</p>
                      <p className="text-xs text-gray-400">{booking.time}</p>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="py-4 px-6 text-center">
                    {getStatusBadge(booking.status)}
                  </td>

                  {/* Price Column */}
                  <td className="py-4 px-6 text-right">
                    <p className="text-sm font-bold text-gray-800">
                      {booking.price}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.paymentMethod}
                    </p>
                  </td>

                  {/* Action Column */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="ดูรายละเอียด"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="เพิ่มเติม"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">แสดง 1-5 จาก 42 รายการ</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
