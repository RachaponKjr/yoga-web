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
  differenceInMinutes,
} from "date-fns";
import { th } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
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

  const [roundCourse, setRoundCourse] = useState<RoundCourseType[]>([]);
  const [roundCourseMonth, setRoundCourseMonth] = useState<RoundCourseType[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  // --- 1. Logic สำหรับเช็คสถานะ (Helper Function) ---
  const getEventStatus = (event: RoundCourseType) => {
    const now = new Date();
    const eventStart = new Date(event.startDateTime);

    // เช็คว่าเลยเวลาเริ่มคลาสหรือยัง
    if (now > eventStart) {
      return {
        label: "ปิดรับสมัคร",
        color: "bg-gray-500",
        disabled: true,
        btnText: "สิ้นสุดแล้ว",
      };
    }

    // เช็คว่าเต็มหรือยัง (ใช้ <= 0 เพื่อความชัวร์)
    const isFullOnline = event.max_online - event.current_online <= 0;
    const isFullWalkIn = event.max_walk_in - event.current_walk_in <= 0;

    if (isFullOnline && isFullWalkIn) {
      return {
        label: "คลาสเต็มแล้ว",
        color: "bg-red-500",
        disabled: true,
        btnText: "ที่ว่างเต็ม",
      };
    }

    return {
      label: "เปิดรับจอง",
      color: "bg-green-600",
      disabled: false,
      btnText: "จองเลย",
    };
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const roundToDay = useCallback(
    ({ today }: { today: string }) => {
      const targetDate = new Date(today);
      const coursesOnDay = roundCourseMonth.filter((course) => {
        const courseDate = new Date(course.startDateTime);
        return isSameDay(courseDate, targetDate);
      });
      setRoundCourse(coursesOnDay);
    },
    [roundCourseMonth],
  );

  const roundToMonth = useCallback(async ({ month }: { month: string }) => {
    setLoading(true);
    try {
      const response = await courseService.getRoundToDay({ month });
      if (response && Array.isArray(response.data)) {
        setRoundCourseMonth(response.data);
      } else {
        setRoundCourseMonth([]);
      }
    } catch (error) {
      console.error(error);
      setRoundCourseMonth([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    roundToMonth({ month: format(currentMonth, "yyyy-MM") });
  }, [currentMonth, roundToMonth]);

  useEffect(() => {
    roundToDay({ today: format(selectedDate, "yyyy-MM-dd") });
  }, [roundCourseMonth, selectedDate, roundToDay]);

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const daysOfWeek = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

    return (
      <div className="w-full">
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

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);
            const dailyCourses = roundCourseMonth.filter((course) =>
              isSameDay(new Date(course.startDateTime), day),
            );
            const hasEvents = dailyCourses.length > 0;

            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative h-14 md:h-24 border rounded-lg flex flex-col items-start justify-start p-2 cursor-pointer transition-all duration-200
                  ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white text-gray-700"}
                  ${isSelected ? "border-blue-500! bg-blue-50! ring-2 ring-blue-200" : "border-gray-100 hover:border-blue-300"}
                `}
              >
                <span
                  className={`text-sm font-medium ${isToday ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center" : ""}`}
                >
                  {format(day, "d")}
                </span>

                {hasEvents && (
                  <div className="mt-1 w-full overflow-hidden">
                    <div className="hidden md:block text-[10px] md:text-xs truncate text-blue-600 bg-blue-100 px-1 rounded mb-0.5">
                      {dailyCourses[0].course.title}
                    </div>
                    {dailyCourses.length > 1 && (
                      <div className="hidden md:block text-[10px] text-gray-400 pl-1">
                        + {dailyCourses.length - 1} คอร์ส
                      </div>
                    )}
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

      {renderCells()}

      {/* Details Section */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          รายละเอียดวันที่{" "}
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
            {roundCourse.map((event) => {
              const status = getEventStatus(event); // เรียกใช้ Logic สถานะ
              const start = new Date(event.startDateTime);
              const end = new Date(event.endDateTime);
              const diffInMinutes = differenceInMinutes(end, start);
              const formattedDuration =
                `${Math.floor(diffInMinutes / 60) > 0 ? `${Math.floor(diffInMinutes / 60)} ชม. ` : ""}${diffInMinutes % 60 > 0 ? `${diffInMinutes % 60} นาที` : ""}`.trim();

              return (
                <div
                  key={event.id}
                  className="relative flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  {/* Status Badge */}
                  <div
                    className={`absolute top-4 md:top-12 right-4 text-[10px] font-bold text-white px-2 py-0.5 rounded-full z-10 shadow-sm ${status.color}`}
                  >
                    {status.label}
                  </div>

                  <div className="relative shrink-0 w-full sm:w-[120px] aspect-video sm:aspect-square rounded-lg border border-gray-200 overflow-hidden bg-white">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_HOST_IMAGE || "http://api.yogabyniti.com/"}${event.course.cover_image}`}
                      alt="course cover"
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 md:gap-4">
                      <h4 className="text-base md:text-lg font-bold text-gray-800 line-clamp-1">
                        {event.course.title}
                      </h4>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md whitespace-nowrap">
                        เริ่ม: {format(start, "HH:mm น.")}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {event.course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">ผู้สอน:</span>{" "}
                        {event.course.teacher.userInfo.firstName}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">เวลา:</span>{" "}
                        {formattedDuration}
                      </div>

                      {/* Slots Online */}
                      <div
                        className={`flex items-center gap-1 ${event.max_online - event.current_online <= 0 ? "text-red-400" : ""}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${event.max_online - event.current_online <= 0 ? "bg-red-400" : "bg-green-500"}`}
                        ></span>
                        Online:{" "}
                        {event.max_online - event.current_online <= 0
                          ? "เต็ม"
                          : event.max_online - event.current_online}
                      </div>

                      {/* Slots Walk-in */}
                      <div
                        className={`flex items-center gap-1 ${event.max_walk_in - event.current_walk_in <= 0 ? "text-red-400" : ""}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${event.max_walk_in - event.current_walk_in <= 0 ? "bg-red-400" : "bg-orange-500"}`}
                        ></span>
                        Walk-in:{" "}
                        {event.max_walk_in - event.current_walk_in <= 0
                          ? "เต็ม"
                          : event.max_walk_in - event.current_walk_in}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/60">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-0.5">
                          ราคาต่อท่าน
                        </span>
                        <div className="flex items-baseline gap-2">
                          {event.course.discount_price ? (
                            <>
                              <span className="text-2xl font-extrabold text-blue-600">
                                ฿{event.course.discount_price.toLocaleString()}
                              </span>
                              <span className="text-sm font-medium text-gray-400 line-through">
                                ฿{event.course.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-extrabold text-blue-600">
                              ฿{event.course.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        disabled={status.disabled}
                        onClick={() =>
                          router.push(
                            `/course?courseId=${event.courseId}&date=${event.startDateTime}`,
                          )
                        }
                        size="sm"
                        className={`px-6 transition-all ${status.disabled ? "bg-gray-300" : "bg-primary text-white hover:bg-primary/90 shadow-sm"}`}
                      >
                        {status.btnText}
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
