"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import DialogAddTime from "@/app/(Instruetor-side)/my-timetable/_components/dialog-add-time";

const CalendarAddTime = () => {
  const router = useRouter();
  // --- Logic State ---
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allRounds, setAllRounds] = useState<RoundCourseType[]>([]);
  const [loading, setLoading] = useState(false);
  // Actions
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // 1. Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await courseService.getMyRound();
      if (Array.isArray(response?.data)) {
        setAllRounds(response.data as RoundCourseType[]);
      } else if (Array.isArray(response)) {
        setAllRounds(response as RoundCourseType[]);
      } else {
        setAllRounds([]);
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
      setAllRounds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Filter Data
  const selectedDateRounds = useMemo(() => {
    return allRounds
      .filter((round) => isSameDay(new Date(round.startDateTime), selectedDate))
      .sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime()
      );
  }, [allRounds, selectedDate]);

  // --- UI Section (Render) ---
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const daysOfWeek = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

    return (
      <div className="w-full">
        {/* หัวตาราง */}
        <div className="grid grid-cols-7 mb-2 border-b pb-2">
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className={`text-center text-sm font-semibold py-2 ${
                index === 0 ? "text-red-500" : "text-gray-500"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* ตารางวันที่ */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {calendarDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            // Filter ข้อมูลของวันนี้
            const dailyCourses = allRounds.filter((course) =>
              isSameDay(new Date(course.startDateTime), day)
            );
            // เรียงลำดับตามเวลา
            dailyCourses.sort(
              (a, b) =>
                new Date(a.startDateTime).getTime() -
                new Date(b.startDateTime).getTime()
            );

            const hasEvents = dailyCourses.length > 0;

            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative min-h-[60px] md:min-h-[100px] border rounded-lg flex flex-col items-start justify-start p-1 md:p-2 cursor-pointer transition-all duration-200
                  ${
                    !isCurrentMonth
                      ? "bg-gray-50/50 text-gray-300"
                      : "bg-white text-gray-700"
                  }
                  ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-100 z-10 shadow-md bg-white"
                      : "border-gray-100 hover:border-blue-300 hover:shadow-sm"
                  }
                `}
              >
                <div className="flex justify-between w-full items-start">
                  {/* เลขวันที่ */}
                  <span
                    className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Mobile Dot (จุดสีสำหรับมือถือ - พื้นที่น้อยแสดงแค่จุด) */}
                  {hasEvents && (
                    <div className="md:hidden w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 mr-1"></div>
                  )}
                </div>

                {/* --- ส่วนที่แก้ไข: แสดงตารางคอร์ส (Desktop Only) --- */}
                {hasEvents && (
                  <div className="hidden md:flex flex-col gap-1 w-full mt-2 overflow-hidden">
                    {/* แสดงสูงสุด 2 รายการ เพื่อไม่ให้ตารางรกเกินไป */}
                    {dailyCourses.slice(0, 2).map((course, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 w-full text-[10px] bg-blue-50 text-blue-700 px-1.5 py-1 rounded border border-blue-100"
                      >
                        <span>เวลาการสอน</span>
                        <span className="w-px h-3 bg-blue-200 mx-0.5"></span>
                        {/* เวลา */}
                        <span className="font-bold shrink-0">
                          {format(new Date(course.startDateTime), "HH:mm")}
                        </span>
                        {/* เส้นคั่น */}
                        {/* ชื่อคอร์ส (ตัดคำถ้าชาวเกิน) */}
                        {/* <span className="truncate font-medium">
                          {course.course?.title}
                        </span> */}
                      </div>
                    ))}

                    {/* ถ้ามีมากกว่า 2 คอร์ส ให้แสดงจำนวนที่เหลือ */}
                    {dailyCourses.length > 2 && (
                      <div className="text-[10px] text-gray-400 pl-1 font-medium">
                        + อีก {dailyCourses.length - 2} คอร์ส
                      </div>
                    )}
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
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {format(currentMonth, "MMMM yyyy", { locale: th })}
            </h2>
            <p className="text-sm text-gray-500">จัดการตารางสอนของคุณ</p>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {renderCells()}

      {/* Details Section (ส่วนล่าง UI เดิม) */}
      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            รายละเอียดวันที่{" "}
            <span className="text-blue-600 underline decoration-blue-300">
              {format(selectedDate, "d MMMM yyyy", { locale: th })}
            </span>
          </h3>
          <DialogAddTime
            date={format(selectedDate, "yyyy-MM-dd")}
            // onSuccess={fetchData}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-blue-600">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>กำลังโหลดข้อมูล...</span>
          </div>
        ) : selectedDateRounds.length > 0 ? (
          <div className="space-y-3">
            {selectedDateRounds.map((event) => {
              const start = new Date(event.startDateTime);
              const end = new Date(event.endDateTime);
              const durationMinutes = differenceInMinutes(end, start);
              const hours = Math.floor(durationMinutes / 60);
              const minutes = durationMinutes % 60;
              const formattedDuration = `${hours > 0 ? `${hours} ชม.` : ""} ${
                minutes > 0 ? `${minutes} นาที` : ""
              }`.trim();

              return (
                <div
                  key={event.id}
                  className="flex flex-col md:flex-row items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="bg-white p-2 relative rounded-lg border border-gray-200 aspect-square overflow-hidden shadow-sm text-center w-full md:w-auto md:h-24 md:min-w-[96px]">
                    {event.course?.cover_image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${event.course.cover_image}`}
                        alt="cover"
                        fill
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-start w-full">
                      <h4 className="text-md font-bold text-gray-800">
                        {event.course?.title}
                      </h4>
                      <div className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                        {format(start, "HH:mm")} - {format(end, "HH:mm")}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {event.course?.description}
                    </p>
                    <div className="flex flex-col md:flex-row justify-between items-center w-full mt-3 gap-3">
                      <div className="flex items-center gap-3 flex-wrap text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          ⏱ {formattedDuration}
                        </span>
                        <span className="flex items-center gap-1">
                          🔵 Online: {event.current_online}/{event.max_online}
                        </span>
                        <span className="flex items-center gap-1">
                          🟠 Walk-in: {event.current_walk_in}/
                          {event.max_walk_in}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <Button
                          onClick={() =>
                            router.push(
                              `/course?courseId=${event.courseId}&date=${format(selectedDate, "yyyy-MM-dd")}`
                            )
                          }
                          variant={"outline"}
                          size={"sm"}
                          className=" cursor-pointer "
                        >
                          Detail Course
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
            <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400">ไม่มีคอร์สเรียนในวันนี้</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarAddTime;
