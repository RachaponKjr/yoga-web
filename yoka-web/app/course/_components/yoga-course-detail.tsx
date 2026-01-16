"use client";
import React, { useCallback, useState } from "react";
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  CheckCircle,
  User,
  Sparkles,
  Share2,
  Heart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { CourseProps } from "../page";
import { formatRoundEnglish, formatRoundTime } from "@/utils/format";
import CourseCalendar from "@/components/CourseCalendar";
import { useBooking } from "@/store/useBooking";
import { isSameDay } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CourseDetailPage = ({
  course,
  date,
}: {
  course: CourseProps;
  date: Date | string;
}) => {
  const [selectRound, setSelectRound] = useState(() => {
    if (date) {
      const targetDate = new Date(date);
      const foundRound = course.rounds.find((r) =>
        isSameDay(new Date(r.startDateTime), targetDate)
      );
      if (foundRound) return foundRound;
    }
    return course.rounds[0];
  });
  const { setBooking } = useBooking();
  const router = useRouter();
  const { dateLabel, timeLabel } = formatRoundEnglish(
    selectRound.startDateTime,
    selectRound.endDateTime
  );

  const handleBooking = useCallback(() => {
    setBooking({
      ...selectRound,
      quantity: 1,
      title: course.title,
      price: course.price,
      discount_price: course.discount_price,
      cover_image: course.cover_image,
    });
  }, [
    course.cover_image,
    course.discount_price,
    course.price,
    course.title,
    selectRound,
    setBooking,
  ]);

  // Calculate Discount Percentage
  const discountPercentage =
    course.discount_price < course.price
      ? Math.round(
          ((course.price - course.discount_price) / course.price) * 100
        )
      : 0;

  const availableSeats = selectRound.max_online - selectRound.current_online;

  return (
    <div className="w-full bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-8xl mx-auto container">
        {/* --- Header Section & Actions --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-sm font-semibold tracking-wide uppercase">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={14} /> Yoga Class
              </span>
              {discountPercentage > 0 && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  Discount {discountPercentage}%
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900 tracking-tight">
              {course.title}
            </h1>
          </div>

          {/* Actions Buttons */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
              <Heart size={20} />
            </button>
            <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* --- Left Content (Main - 8 cols) --- */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Image Gallery (Modern Grid Style) */}
            <div className="grid grid-cols-4 grid-rows-2 gap-3 overflow-hidden ">
              {/* รูปใหญ่ซ้าย */}
              <div
                className={`col-span-4 md:col-span-3 aspect-16/12 row-span-2 relative group cursor-pointer overflow-hidden bg-slate-200 rounded-2xl`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${course.cover_image}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Main Course Image"
                  fill
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* รูปเล็กขวา */}
              <div className="hidden md:flex flex-col col-span-1 row-span-2 gap-3 h-full">
                {course.images && course.images.length > 0 ? (
                  course.images.slice(0, 2).map((image, index) => (
                    <div
                      key={index}
                      className="flex-1 relative overflow-hidden group bg-slate-200 aspect-square rounded-2xl"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${image}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={`Gallery Image ${index + 1}`}
                        fill
                      />
                      {index === 1 && course.images.length > 2 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer group-hover:bg-black/40 transition-colors">
                          <span className="text-white font-bold text-lg">
                            +{course.images.length - 2} photos
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // Placeholder ถ้าไม่มีรูปอื่น
                  <div className="h-full bg-slate-100 flex items-center justify-center text-slate-400 font-medium">
                    No extra photos
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="text-emerald-600" size={24} />
                About this course
              </h3>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                <p className="text-slate-600 whitespace-pre-wrap font-medium">
                  {course.about || "ไม่พบข้อมูล"}
                </p>
                {/* ตัวอย่างการเพิ่ม List (ถ้ามีข้อมูล) */}
                {/* <ul>
                    <li>Suitable for all levels</li>
                    <li>Mats and towels provided</li>
                </ul> */}
              </div>
            </div>

            {/* Instructor Section (Enhanced) */}
            <div className="bg-linear-to-br from-emerald-50 to-white rounded-3xl p-8 border border-emerald-100 flex flex-col sm:flex-row items-center sm:items-start gap-8 shadow-sm relative overflow-hidden">
              {/* Background Pattern Decor */}
              <div className="absolute right-0 top-0 -mt-10 -mr-10 text-emerald-100 opacity-50">
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="100" cy="100" r="100" fill="currentColor" />
                </svg>
              </div>

              <Avatar className="size-24 border-4 border-white shadow-md z-10">
                {course.teacher?.userInfo?.avatar ? (
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${course.teacher?.userInfo?.avatar}`}
                    className="object-cover"
                  />
                ) : (
                  <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" />
                )}
                {course.teacher?.userInfo?.firstName && (
                  <AvatarFallback className="bg-emerald-200 text-emerald-800 font-bold text-xl">
                    {course.teacher.userInfo.firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="text-center sm:text-left flex-1 z-10">
                <span className="text-sm font-extrabold text-emerald-600 tracking-wider uppercase mb-2 block">
                  Your Instructor
                </span>
                <h4 className="text-2xl font-bold text-slate-900">
                  {course.teacher?.userInfo?.firstName || "Professional"}{" "}
                  {course.teacher?.userInfo?.lastName || "Instructor"}
                </h4>
                <p className="text-slate-600 text-base mt-3 leading-relaxed">
                  {course.teacher?.userInfo?.experience ||
                    "Certified yoga instructor with over 5 years of experience specializing in Hatha and Vinyasa flow. Passionate about helping students find balance and strength."}
                </p>
                <div className="mt-6 flex justify-center sm:justify-start gap-4">
                  <button
                    onClick={() => router.push(`/instructor`)}
                    className="text-emerald-700 font-semibold text-sm border-2 border-emerald-600/30 px-5 py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Sidebar (Booking Card - 4 cols) --- */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-8">
              {/* Booking Card (Elevated) */}
              <div className="bg-white shadow-md flex flex-col gap-4 shadow-emerald-100/50 border border-slate-100 rounded-3xl p-6 lg:p-8 overflow-hidden relative">
                {/* Price Section */}
                <div className="">
                  <p className="text-slate-500 font-medium text-sm mb-1">
                    Total Price (per person)
                  </p>
                  <div className="flex items-end gap-3 flex-wrap">
                    <div className="text-4xl font-extrabold text-slate-900">
                      ฿{course.discount_price.toLocaleString()}
                    </div>
                    {discountPercentage > 0 && (
                      <>
                        <span className="text-slate-400 text-lg line-through font-medium mb-1.5">
                          ฿{course.price.toLocaleString()}
                        </span>
                        <span className="bg-red-100 text-red-700 text-xs font-extrabold px-2.5 py-1 rounded-full mb-2 ml-auto">
                          SAVE {discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Details Info */}
                <div className="space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100/80">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">
                      <Calendar size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Date
                      </span>
                      <span className="text-slate-900 font-bold text-[15px]">
                        {dateLabel}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-slate-200/60"></div>{" "}
                  {/* Divider */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">
                      <Clock size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Time
                      </span>
                      <span className="text-slate-900 font-bold text-[15px]">
                        {timeLabel}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-slate-200/60"></div>{" "}
                  {/* Divider */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Availability
                      </span>
                      <span
                        className={`${availableSeats > 3 ? "text-emerald-600" : "text-orange-600"} font-bold text-[15px]`}
                      >
                        {availableSeats > 0
                          ? `${availableSeats} spots left`
                          : "Sold Out"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100/80">
                  <h6 className="text-lg font-semibold mb-2">หมายเหตุ</h6>
                  <p className="text-sm text-slate-600">
                    กรุณาตรวจสอบตารางวันการเรียนก่อนการจอง
                  </p>
                </div>

                {/* CTA Button (Gradient) */}
                <Link
                  href={`/course/booking?roundId=${selectRound.id}`}
                  onClick={handleBooking}
                  className={`w-full group flex items-center justify-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200/50 transition-all duration-300 active:scale-[0.98] ${availableSeats === 0 ? "pointer-events-none opacity-70 grayscale" : ""}`}
                >
                  <span>Book Now</span>
                  <CheckCircle
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <p className="text-center text-xs text-slate-400 mt-5 flex items-center justify-center gap-1.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-emerald-500"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Secure payment. Cancel within 24h for full refund.
                </p>
              </div>

              {/* Calendar Widget (Separate Card) */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">ตารางวันการเรียน</h4>
                <CourseCalendar
                  rounds={course.rounds}
                  selectedDate={new Date(selectRound.startDateTime)}
                  onDateSelect={(date, rounds) => {
                    if (rounds && rounds.length > 0) {
                      setSelectRound(rounds[0]);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
