import {
  Search,
  Download,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { bookingService } from "@/service/booking.service";
import type { BookingType } from "@/types/booking.type";
import { formatDate } from "@/utils/format";
import DialogAddBooking from "./DialogAddBooking";
import DialogEdit from "./dialog/DialogEdit";

const BookingPage = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);

  // 1. เพิ่ม State สำหรับคำค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      const response = await bookingService.getAllBooking();
      console.log(response);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchBookings();
  }, [fetchBookings]);

  // 2. Logic การกรองข้อมูล (Filter)
  const filteredBookings = bookings.filter((booking) => {
    const term = searchTerm.toLowerCase();

    // ดึงค่า field ต่างๆ มาเตรียมไว้ (กัน null ด้วย || "")
    const email = booking.student?.email?.toLowerCase() || "";
    const phone = booking.student?.userInfo?.phone_number?.toLowerCase() || "";
    const courseTitle = booking.round?.course?.title?.toLowerCase() || "";
    const status = booking.status?.toLowerCase() || "";
    const price = booking.price.toString(); // ค้นหาจากราคาได้ด้วย

    // เช็คว่ามีคำค้นหาอยู่ใน field ใด field หนึ่งหรือไม่
    return (
      email.includes(term) ||
      phone.includes(term) ||
      courseTitle.includes(term) ||
      status.includes(term) ||
      price.includes(term)
    );
  });

  // Function แปลงสถานะเป็น Badge สวยๆ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
            <CheckCircle size={12} /> ชำระแล้ว
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
            <Clock size={12} /> รอชำระ
          </span>
        );
      case "CANCELLED":
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
          <DialogAddBooking />
        </div>
      </div>

      {/* 2. Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar: Search & Filter */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 items-center bg-white">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            {/* 3. ผูก Input กับ State */}
            <input
              type="text"
              placeholder="ค้นหาชื่อสมาชิก, คลาส, หรือรหัส..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              {/* 4. ใช้ filteredBookings ในการ Map ข้อมูล */}
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    {/* Member Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* ผมใส่ Avatar placeholder ให้เผื่อรูปไม่มี */}
                        <img
                          src={`${"http://119.59.99.141:4001/"}${
                            booking.student.userInfo.avatar || ""
                          }`}
                          alt={booking.student.email}
                          className="h-10 w-10 rounded-full object-cover border border-gray-100"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {booking.student.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.student.userInfo?.phone_number || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Class Column */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.round.course.title}
                        </p>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        <p>{formatDate(String(booking.createdAt))}</p>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(booking.status)}
                    </td>

                    {/* Price Column */}
                    <td className="py-4 px-6 text-right">
                      <p className="text-sm font-bold text-gray-800">
                        {booking.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">Credit Card</p>
                    </td>

                    {/* Action Column */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="ดูรายละเอียด"
                        >
                          <Eye size={18} />
                        </button>
                        <DialogEdit
                          booking={booking}
                          onComplete={fetchBookings}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // 5. กรณีไม่พบข้อมูล
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    ไม่พบข้อมูลที่ค้นหา "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            แสดง {filteredBookings.length} รายการ
          </p>
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
