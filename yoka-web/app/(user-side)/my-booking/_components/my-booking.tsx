"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, CheckCircle2, XCircle, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { BookingType } from "@/types/booking.type";
import { bookingService } from "@/service/booking.service";
import { useAuthStore } from "@/store/useAuthStore";

type BookingStatus = "PENDING" | "PAID" | "CANCELLED";

const MyBooking = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<BookingType[]>([]);

  // 1. เพิ่ม State สำหรับเก็บคำค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const res = await bookingService.getMyBooking(user?.id);
      if (res.response.success) {
        setBookings(res.response.data);
      }
    };
    fetchBookings();
  }, [user]);

  // 2. Logic การ Filter ข้อมูล (ค้นหาจาก ชื่อคอร์ส หรือ ชื่อครู)
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const term = searchTerm.toLowerCase();

      // ข้อมูลที่จะใช้ค้นหา
      const courseTitle = booking?.round?.course?.title.toLowerCase();
      const teacherFirstName =
        booking?.round?.course?.teacher?.userInfo?.firstName?.toLowerCase() ||
        "";
      const teacherLastName =
        booking?.round?.course?.teacher?.userInfo?.lastName?.toLowerCase() ||
        "";
      const teacherFullName = `${teacherFirstName} ${teacherLastName}`;

      // เช็คว่าคำค้นหา ตรงกับ ชื่อคอร์ส หรือ ชื่อครู หรือไม่
      return courseTitle?.includes(term) || teacherFullName.includes(term);
    });
  }, [bookings, searchTerm]); // ทำงานใหม่เฉพาะตอน bookings หรือ searchTerm เปลี่ยน

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">All Schedule</h1>
            <p className="text-zinc-500 mt-1">
              Here is a list of all your class history and upcoming sessions.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            {/* 3. ผูก Input กับ State */}
            <input
              type="text"
              placeholder="Search class or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="space-y-4">
          {/* 4. ใช้ filteredBookings ในการแสดงผลแทน bookings */}
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : // ปรับ EmptyState นิดหน่อยเพื่อให้รู้ว่าถ้าค้นหาไม่เจอ ให้แสดงข้อความอื่น
          bookings.length > 0 ? (
            <div className="text-center py-10 text-zinc-500">
              No classes found matching &quot;{searchTerm}&quot;
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components (เหมือนเดิม) ---

const BookingCard = ({ booking }: { booking: BookingType }) => {
  return (
    <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-300 flex flex-col md:flex-row gap-5">
      {/* Image Section */}
      <div className="relative w-full md:w-48 aspect-video md:h-auto rounded-xl overflow-hidden bg-zinc-100 shrink-0">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${booking?.round?.course?.cover_image}`}
          alt={booking?.round?.course?.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-zinc-900 line-clamp-1">
                {booking?.round?.course?.title}
              </h3>
              {/* ✅ แสดงวันที่ชำระเงิน ถ้าจ่ายแล้ว */}
              {booking?.status === "PAID" && booking?.paidAt && (
                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                  Paid on{" "}
                  {format(new Date(booking?.paidAt), "dd MMM yyyy, hh:mm a")}
                </p>
              )}
            </div>
            <StatusBadge status={booking?.status as BookingStatus} />
          </div>

          {/* Meta Info (Calendar & Clock) */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>
                {booking?.round?.startDateTime
                  ? format(
                      new Date(booking?.round?.startDateTime),
                      "EEE, dd MMM yyyy",
                    )
                  : "TBA"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>
                {booking?.round?.startDateTime &&
                booking?.round?.endDateTime ? (
                  <>
                    {format(new Date(booking?.round?.startDateTime), "hh:mm a")}{" "}
                    - {format(new Date(booking?.round?.endDateTime), "hh:mm a")}
                  </>
                ) : (
                  <span>-</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Footer: Instructor */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
          <div className="flex items-center gap-2">
            <Avatar className="size-8 border border-zinc-100">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_API_URL}${booking?.round?.course?.teacher?.userInfo?.avatar}`}
              />
              <AvatarFallback className="bg-zinc-100 text-xs">
                {booking?.round?.course?.teacher?.userInfo?.firstName?.charAt(
                  0,
                )}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-zinc-700">
              {booking?.round?.course?.teacher?.userInfo?.firstName}{" "}
              {booking?.round?.course?.teacher?.userInfo?.lastName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  switch (status) {
    case "PAID":
      return (
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
          <CheckCircle2 size={12} /> Paid
        </div>
      );
    case "PENDING":
      return (
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold border border-zinc-200">
          <CheckCircle2 size={12} /> Pending
        </div>
      );
    case "CANCELLED":
      return (
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
          <XCircle size={12} /> CANCELLED
        </div>
      );
    default:
      return null;
  }
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <Calendar className="text-zinc-300" size={32} />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-1">
        No bookings found
      </h3>
      <p className="text-zinc-500 text-sm max-w-xs mb-6">
        You haven&apos;t booked any classes yet.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
      >
        Browse Courses
      </Link>
    </div>
  );
};

export default MyBooking;
