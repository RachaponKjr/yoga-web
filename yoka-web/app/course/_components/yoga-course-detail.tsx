"use client";
import React, { useCallback, useState } from "react";
import { MapPin, Star, Clock, Calendar, CheckCircle, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { CourseProps } from "../page";
import { formatRoundEnglish, formatRoundTime } from "@/utils/format";
import CourseCalendar from "@/components/CourseCalendar";
import { useBooking } from "@/store/useBooking";
import { useOmise } from "@/hooks/useOmise";

const CourseDetailPage = ({ course }: { course: CourseProps }) => {
  const [selectRound, setSelectRound] = useState(course.rounds[0]);
  const { setBooking } = useBooking();

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

  return (
    <div className="max-w-[1600px] mx-auto p-8 md:p-12 bg-white rounded-2xl    font-sans text-slate-800">
      {/* Layout หลักแบ่งเป็น 2 ส่วน: เนื้อหา (2 ส่วน) และ การ์ดจอง (1 ส่วน) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* --- Left Content (Main) --- */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Header Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-sm font-medium">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                Yoga
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                Beginner
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900">
              {course.title}
            </h1>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-orange-400 fill-orange-400" />
                <span className="font-semibold text-slate-800">4.8</span> (124
                รีวิว)
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>สุขุมวิท 39, กรุงเทพฯ</span>
              </div>
            </div>
          </div>

          {/* Image Gallery (Bento Grid Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[400px] md:h-[450px] overflow-hidden">
            {/* รูปใหญ่ซ้าย */}
            <div className="md:col-span-2 h-full relative group cursor-pointer rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Main"
              />
            </div>
            {/* รูปเล็กขวา 2 รูป */}
            <div className="hidden md:flex flex-col gap-3 h-full">
              <div className="flex-1 relative overflow-hidden group rounded-2xl o">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Sub 1"
                />
              </div>
              <div className="flex-1 relative overflow-hidden group rounded-2xl o">
                <img
                  src="https://images.unsplash.com/photo-1599447421405-0e32096b3071?q=80&w=2070&auto=format&fit=crop"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Sub 2"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-medium border border-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    ดูรูปทั้งหมด
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              รายละเอียดคอร์ส
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {course.description}
            </p>
          </div>

          {/* Instructor Section */}
          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="size-16">
              <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <span className="text-sm font-bold text-emerald-600 tracking-wide uppercase">
                ครูผู้สอน
              </span>
              <h4 className="text-xl font-bold text-slate-900 mt-1">
                {course.teacher?.userInfo?.firstName || "ไม่ระบุ"}{" "}
                {course.teacher?.userInfo?.lastName || "ไม่ระบุ"}
              </h4>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                {course.teacher?.userInfo?.experience || "ไม่ระบุ"}
              </p>
            </div>
            <button className="text-slate-900 font-medium text-sm border border-slate-300 px-4 py-2 rounded-lg hover:bg-white transition-colors">
              ดูโปรไฟล์
            </button>
          </div>
        </div>

        {/* --- Right Sidebar (Booking Card) --- */}
        <div className="flex flex-col gap-4">
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white shadow-sm border border-slate-100 rounded-2xl p-4 lg:p-6">
              <div className="flex justify-between items-end w-full">
                {/* ส่วนของการแสดงราคา */}
                <div className="flex items-center justify-between gap-3 w-full">
                  <div>
                    {/* ถ้ามีส่วนลด ให้แสดงราคาเต็มที่ขีดฆ่า */}
                    {course.discount_price < course.price && (
                      <span className="text-slate-400 text-sm line-through">
                        THB {course.price.toLocaleString()}
                      </span>
                    )}

                    <div className="text-3xl font-extrabold text-emerald-600">
                      THB {course.discount_price.toLocaleString()}
                    </div>
                  </div>

                  {/* แสดงป้าย SAVE % เฉพาะเมื่อมีส่วนลดเท่านั้น */}
                  {course.discount_price < course.price && (
                    <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
                      SAVE{" "}
                      {Math.round(
                        ((course.price - course.discount_price) /
                          course.price) *
                          100
                      )}
                      %
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <Calendar
                    className="text-slate-400 shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase">
                      วันที่เรียน
                    </span>
                    <span className="text-slate-800 font-medium">
                      {dateLabel}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <Clock className="text-slate-400 shrink-0 mt-0.5" size={20} />
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase">
                      เวลา
                    </span>
                    <span className="text-slate-800 font-medium">
                      {timeLabel}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <User className="text-slate-400 shrink-0 mt-0.5" size={20} />
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase">
                      ที่ว่าง สำหรับจองออนไลน์
                    </span>
                    <span className="text-emerald-600 font-medium">
                      ว่าง {selectRound.max_online - selectRound.current_online}{" "}
                      ที่นั่งสุดท้าย
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold py-3 rounded-md shadow-sm shadow-emerald-200 transition-all active:scale-[0.98]"
              >
                <Link
                  href={`/course/booking?roundId=${selectRound.id}`}
                  className="w-full h-full flex items-center justify-center"
                >
                  จองคอร์สเรียน
                </Link>
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                รับประกันคืนเงินภายใน 24 ชม. หลังจอง
              </p>
            </div>
          </div>
          <CourseCalendar
            rounds={course.rounds}
            onDateSelect={(date, rounds) => setSelectRound(rounds[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
