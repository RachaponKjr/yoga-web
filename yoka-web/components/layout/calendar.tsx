"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
  parseISO,
  differenceInMinutes,
} from "date-fns";
import { th } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Loader2,
} from "lucide-react";
import { courseService } from "@/service/course.service";
import { RoundCourseType } from "@/types/course.type";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();
  // roundCourse = รายการคอร์สของ "วันที่เลือก"
  const [roundCourse, setRoundCourse] = useState<RoundCourseType[]>([]);

  // roundCourseMonth = รายการคอร์สของ "ทั้งเดือน"
  const [roundCourseMonth, setRoundCourseMonth] = useState<RoundCourseType[]>(
    []
  );

  const [loading, setLoading] = useState(false);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // --- 1. Logic ใหม่: Filter ข้อมูลรายวันจากข้อมูลรายเดือนที่มีอยู่แล้ว ---
  const roundToDay = useCallback(
    ({ today }: { today: string }) => {
      // แปลง string 'YYYY-MM-DD' กลับมาเทียบกับข้อมูลที่มี
      const targetDate = new Date(today);

      const coursesOnDay = roundCourseMonth.filter((course) => {
        const courseDate = new Date(course.startDateTime);
        return isSameDay(courseDate, targetDate);
      });

      setRoundCourse(coursesOnDay);
    },
    [roundCourseMonth]
  );

  // --- 2. ดึงข้อมูลรายเดือน ---
  const roundToMonth = useCallback(async ({ month }: { month: string }) => {
    setLoading(true);
    // setRoundCourseMonth([]); // อาจจะไม่ต้อง clear ทิ้งเพื่อให้ UI ไม่กระพริบหายไป
    try {
      const response = await courseService.getRoundToDay({ month });
      if (response && Array.isArray(response.data)) {
        // เช็ค response ตามโครงสร้าง API จริงของคุณ (สมมติว่า return array มาเลย หรือ response.data)
        // ถ้า service return array โดยตรง:
        setRoundCourseMonth(response.data);

        // หรือถ้า service return object { success: true, data: [] }
        // setRoundCourseMonth(response.data);
      } else {
        setRoundCourseMonth([]);
      }
    } catch (error) {
      console.log(error);
      setRoundCourseMonth([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect 1: เมื่อเปลี่ยนเดือน ให้ดึงข้อมูลใหม่
  useEffect(() => {
    roundToMonth({ month: format(currentMonth, "yyyy-MM") });
  }, [currentMonth, roundToMonth]);

  // Effect 2: เมื่อข้อมูลรายเดือนมาแล้ว หรือเปลี่ยนวันที่เลือก ให้ update ข้อมูลรายวันด้านล่างใหม่
  useEffect(() => {
    // ทุกครั้งที่ roundCourseMonth เปลี่ยน หรือ selectedDate เปลี่ยน ให้ filter ข้อมูลใส่ roundCourse ใหม่
    roundToDay({ today: format(selectedDate, "yyyy-MM-dd") });
  }, [roundCourseMonth, selectedDate, roundToDay]);

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    const daysOfWeek = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

    return (
      <div className="w-full">
        {/* หัวตาราง (วันในสัปดาห์) */}
        <div className="grid grid-cols-7 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* ตารางวันที่ */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            // --- 3. หา Course ที่ตรงกับวันนี้ ---
            const dailyCourses = roundCourseMonth.filter((course) =>
              isSameDay(new Date(course.startDateTime), day)
            );
            const hasEvents = dailyCourses.length > 0;

            return (
              <div
                key={day.toString()}
                onClick={() => {
                  setSelectedDate(day);
                  // roundToDay ถูกเรียกผ่าน useEffect แล้ว ไม่ต้องเรียกซ้ำตรงนี้ก็ได้
                }}
                className={`
                  relative h-14 md:h-24 border rounded-lg flex flex-col items-start justify-start p-2 cursor-pointer transition-all duration-200
                  ${
                    !isCurrentMonth
                      ? "bg-gray-50 text-gray-400"
                      : "bg-white text-gray-700"
                  }
                  ${
                    isSelected
                      ? "border-blue-500! bg-blue-50! ring-2 ring-blue-200"
                      : "border-gray-100 hover:border-blue-300"
                  }
                `}
              >
                {/* เลขวันที่ */}
                <span
                  className={`text-sm font-medium ${
                    isToday
                      ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                      : ""
                  }`}
                >
                  {format(day, "d")}
                </span>

                {/* จุดแสดง Event */}
                {hasEvents && (
                  <div className="mt-1 w-full overflow-hidden">
                    {/* Desktop: แสดงชื่อคอร์สแรก */}
                    <div className="hidden md:block text-xs truncate text-blue-600 bg-blue-100 px-1 rounded mb-0.5">
                      {dailyCourses[0].course.title}
                    </div>
                    {/* ถ้ามีมากกว่า 1 คอร์ส ให้บอกจำนวนเพิ่ม */}
                    {dailyCourses.length > 1 && (
                      <div className="hidden md:block text-[10px] text-gray-400 pl-1">
                        + {dailyCourses.length - 1} คอร์ส
                      </div>
                    )}

                    {/* Mobile: จุดสี */}
                    <div className="md:hidden flex justify-center gap-0.5 mt-1">
                      {dailyCourses.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white shadow-xl rounded-xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          {format(currentMonth, "MMMM yyyy", { locale: th })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {renderCells()}

      {/* Details Section */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          รายละเอียดวันที่
          <span className="text-blue-600">
            {format(selectedDate, "d MMMM yyyy", { locale: th })}
          </span>
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : roundCourse.length > 0 ? (
          <div className="space-y-4">
            {" "}
            {/* เพิ่ม space-y ให้ห่างกันสวยงาม */}
            {roundCourse.map((event) => {
              // --- 🛠️ แก้ไข Logic คำนวณเวลาให้ถูกต้อง ---
              const start = new Date(event.startDateTime);
              const end = new Date(event.endDateTime);
              const diffInMinutes = differenceInMinutes(end, start);
              const hours = Math.floor(diffInMinutes / 60);
              const minutes = diffInMinutes % 60;
              const formattedDuration =
                `${hours > 0 ? `${hours} ชม.` : ""} ${minutes > 0 ? `${minutes} นาที` : ""}`.trim();

              return (
                <div
                  key={event.id}
                  // 📱 Mobile: flex-col (ตั้ง), 🖥️ Desktop: flex-row (นอน)
                  className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  {/* --- Image Section --- */}
                  <div className="relative shrink-0 w-full sm:w-[120px] aspect-video sm:aspect-square rounded-lg border border-gray-200 overflow-hidden bg-white">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://119.59.99.141:4001/"}${event.course.cover_image}`}
                      alt="course cover"
                      fill
                      className="object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* --- Content Section --- */}
                  <div className="flex-1 w-full min-w-0">
                    {" "}
                    {/* min-w-0 ช่วยแก้ปัญหา truncate ไม่ทำงานใน flex */}
                    {/* Header: Title & Date */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 md:gap-4">
                      <h4 className="text-base md:text-lg font-bold text-gray-800 line-clamp-1">
                        {event.course.title}
                      </h4>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md whitespace-nowrap">
                        เริ่ม: {format(start, "d MMM yy", { locale: th })}
                      </span>
                    </div>
                    {/* Description */}
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {event.course.description}
                    </p>
                    {/* Details Tags (Responsive Grid/Flex) */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">ผู้สอน:</span>
                        {event.course.teacher.userInfo.firstName}{" "}
                        {event.course.teacher.userInfo.lastName}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">เวลา:</span>
                        {formattedDuration}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Online: {event.max_online}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        Walk-in: {event.max_walk_in}
                      </div>
                    </div>
                    {/* Footer: Price & Button */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/60">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">
                          ราคาต่อท่าน
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          ฿{event.course.price.toLocaleString()}
                        </span>
                      </div>

                      <Button
                        onClick={() =>
                          router.push(
                            `/course?courseId=${event.courseId}&date=${event.startDateTime}`
                          )
                        }
                        size="sm"
                        className="bg-primary text-white hover:bg-primary/90 shadow-sm px-6"
                      >
                        จองเลย
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">ไม่มีคอร์สเรียนในวันนี้</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
