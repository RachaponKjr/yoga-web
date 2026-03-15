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
  ChevronRight,
  ShieldCheck,
  Maximize2,
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
        isSameDay(new Date(r.startDateTime), targetDate),
      );
      if (foundRound) return foundRound;
    }
    return course.rounds[0];
  });
  const { setBooking } = useBooking();
  const router = useRouter();
  const { dateLabel, timeLabel } = formatRoundEnglish(
    selectRound.startDateTime,
    selectRound.endDateTime,
  );
  console.log(selectRound);

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // --- แก้ไข Logic ส่วนที่ 1: การคำนวณราคาและส่วนลด ---

  // เช็คว่ามีส่วนลดจริงๆ หรือไม่ (ต้องมากกว่า 0 และน้อยกว่าราคาเต็ม)
  const hasDiscount =
    course.discount_price !== null &&
    course.discount_price > 0 &&
    course.discount_price < course.price;

  // ราคาที่จะนำไปแสดงผล (ถ้ามีส่วนลดใช้ discount_price, ถ้าไม่มีใช้ price ปกติ)
  const displayPrice = hasDiscount ? course.discount_price : course.price;

  // คำนวณ % ส่วนลด (เฉพาะเมื่อมีส่วนลดจริง)
  const discountPercentage = hasDiscount
    ? Math.round(((course.price - course.discount_price) / course.price) * 100)
    : 0;
  // ----------------------------------------------------

  const handleBooking = useCallback(() => {
    setBooking({
      ...selectRound,
      quantity: 1,
      title: course.title,
      price: course.price,
      discount_price: course.discount_price, // ส่งค่าเดิมไป (store น่าจะจัดการต่อเอง)
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

  const availableSeats = selectRound.max_online - selectRound.current_online;

  return (
    <div className="w-full bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto container flex flex-col gap-4">
        {/* --- Header Section & Actions --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-sm font-semibold tracking-wide uppercase">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={14} /> Yoga Class
              </span>
              {/* แสดงป้ายส่วนลดเมื่อมีส่วนลดจริงเท่านั้น */}
              {hasDiscount && (
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
          {/* <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
              <Heart size={20} />
            </button>
            <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all">
              <Share2 size={20} />
            </button>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* --- Left Content (Main - 8 cols) --- */}
          <div className="lg:col-span-7 flex flex-col gap-6 md:gap-12">
            {/* --- Gallery Grid --- */}
            <div className="grid grid-cols-1 md:grid-col-1 gap-3 h-[300px] md:h-[650px]">
              {/* รูปหลัก (Feature Image) */}
              <div
                className="md:col-span-3 relative overflow-hidden rounded-3xl  group/main shadow-sm border border-slate-100"
                onClick={() => setSelectedImg(course.cover_image)}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "https://api.yogabyniti.com/"}${course.cover_image}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover/main:scale-105"
                  alt="Main Course Image"
                  fill
                  priority
                />
                {/* Overlay on Hover */}
                {/* <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <Maximize2 className="text-white opacity-0 group-hover/main:opacity-100 transition-opacity scale-75 group-hover/main:scale-100" />
                </div> */}
              </div>
            </div>

            {/* รูปย่อย (Side Images) */}
            {/* <div className="hidden flex-col gap-3">
              {course.images && course.images.length > 0 ? (
                course.images
                  .slice(0, 2)
                  .map((image: string, index: number) => (
                    <div
                      key={index}
                      className="relative flex-1 overflow-hidden rounded-3xl cursor-zoom-in group/sub shadow-sm border border-slate-100"
                      onClick={() => setSelectedImg(image)}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${image}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/sub:scale-110"
                        alt={`Gallery Image ${index + 1}`}
                        fill
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/sub:bg-black/10 transition-colors duration-300" />

                      {index === 1 && course.images.length > 2 && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white transition-all group-hover/sub:bg-black/50">
                          <span className="text-2xl font-black">
                            +{course.images.length - 2}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Photos
                          </span>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div className="flex-1 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                  <span className="text-xs font-medium uppercase tracking-tighter">
                    No more pics
                  </span>
                </div>
              )}
            </div> */}

            {/* Description */}
            <div className="bg-white">
              <h3 className="text-xl uppercase font-bold text-slate-900 mb-4 flex items-center gap-2">
                About this course
              </h3>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                <p className="text-slate-600 whitespace-pre-wrap text-sm md:text-base font-medium">
                  {course.about || "ไม่พบข้อมูล"}
                </p>
              </div>
            </div>

            {/* Instructor Section */}
            <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Sparkles size={120} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <Avatar className="size-28 border-4 border-white/20 shadow-2xl">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "https://api.yogabyniti.com/"}${course.teacher?.userInfo?.avatar}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-emerald-500 text-3xl font-bold">
                    {course.teacher?.userInfo?.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left space-y-2 md:space-y-4">
                  <div>
                    <span className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">
                      Certified Instructor
                    </span>
                    <h3 className="text-3xl font-black mt-1">
                      {course.teacher?.userInfo?.firstName}{" "}
                      {course.teacher?.userInfo?.lastName}
                    </h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed max-w-xl text-sm md:text-base italic line-clamp-5">
                    &quot;
                    {course.teacher?.userInfo?.experience ||
                      "With years of practice, I focus on harmonizing body and mind through movement."}
                    &quot;
                  </p>
                  <button
                    onClick={() => router.push(`/instructors`)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors"
                  >
                    Instructor Profile <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* --- Right Sidebar (Booking Card - 4 cols) --- */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="sticky flex flex-col-reverse gap-4 md:flex-col top-8">
              {/* Booking Card (Elevated & Refined) */}
              <div className="bg-white shadow-sm flex flex-col gap-3 border border-slate-100 rounded-2xl p-6 lg:p-8 overflow-hidden transition-all duration-500">
                {/* ส่วนราคา: ปรับให้ดูหรูหราและชัดเจน */}
                <div className="relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em] mb-1">
                        Price
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">
                          ฿{displayPrice.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="text-slate-400 text-sm line-through decoration-red-400/50">
                            ฿{course.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {hasDiscount && (
                      <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wider animate-pulse">
                        -{discountPercentage}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Info: เปลี่ยนเป็น Grid เพื่อความ Modern และประหยัดพื้นที่ */}
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      label: "Schedule",
                      value: dateLabel,
                      icon: <Calendar size={18} strokeWidth={2.5} />,
                      color: "text-emerald-600",
                      bg: "bg-emerald-50",
                    },
                    {
                      label: "Time",
                      value: timeLabel,
                      icon: <Clock size={18} strokeWidth={2.5} />,
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Availability",
                      value:
                        availableSeats > 0
                          ? `${availableSeats} spots left`
                          : "Sold Out",
                      icon: <User size={18} strokeWidth={2.5} />,
                      color:
                        availableSeats > 3
                          ? "text-emerald-600"
                          : "text-orange-600",
                      bg: availableSeats > 3 ? "bg-emerald-50" : "bg-orange-50",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100/80 hover:bg-white hover:shadow-sm transition-all duration-300"
                    >
                      <div
                        className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p
                          className={`text-sm font-black ${item.label === "Availability" ? item.color : "text-slate-700"}`}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ข้อมูลเสริม: ใช้ Accordion-style หรือจัดวางให้เบาสบายตา */}
                <div className="space-y-4 py-2 border-y border-slate-50">
                  <div className="group">
                    <h6 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Note
                    </h6>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium pl-3.5">
                      {selectRound.description ||
                        "No special requirements for this session."}
                    </p>
                  </div>

                  <div className="group">
                    <h6 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Highlights
                    </h6>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium pl-3.5 line-clamp-2">
                      {selectRound.about}
                    </p>
                  </div>
                </div>

                {/* ปุ่มจอง: เน้นความเด่นและ Interactive */}
                <div className="space-y-4">
                  <Link
                    href={`/course/booking?roundId=${selectRound.id}`}
                    onClick={handleBooking}
                    className={`
        relative w-full overflow-hidden group flex items-center justify-center gap-3 py-4.5 rounded-[1.25rem] text-white font-black text-lg transition-all duration-300
        ${
          availableSeats === 0
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-slate-900 hover:bg-emerald-600 active:scale-[0.98]"
        }
      `}
                  >
                    {/* Shine effect animation */}
                    {availableSeats > 0 && (
                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
                    )}

                    <span className="relative z-10">
                      {availableSeats === 0 ? "Fully Booked" : "Booking Now"}
                    </span>
                    <CheckCircle
                      size={22}
                      className={`relative z-10 ${availableSeats === 0 ? "hidden" : ""}`}
                    />
                  </Link>

                  {/* Trust & Policy */}
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-tighter">
                      <ShieldCheck size={14} className="animate-pulse" />
                      Safe & Secure Checkout
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium text-center leading-relaxed">
                      Free cancellation up to 24 hours before <br />
                      the start time for a full refund.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-0">
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
      <style jsx>{`
        @keyframes shine {
          from {
            left: -100%;
          }
          to {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseDetailPage;
