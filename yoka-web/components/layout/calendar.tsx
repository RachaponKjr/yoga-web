"use client";

import { imageUrl } from "@/lib/image-url";
import React, { useEffect, useMemo, useState } from "react";
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
import { enGB } from "date-fns/locale";
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

  const [roundCourseMonth, setRoundCourseMonth] = useState<RoundCourseType[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- 1. Logic สำหรับเช็คสถานะ (Helper Function) ---
  const getEventStatus = (event: RoundCourseType) => {
    const now = new Date();
    const eventStart = new Date(event.startDateTime);

    // เช็คว่าเลยเวลาเริ่มคลาสหรือยัง
    if (now > eventStart) {
      return {
        label: "Booking closed",
        color: "bg-[#e9ebe3] text-[#737b62]",
        disabled: true,
        btnText: "Ended",
      };
    }

    // เช็คว่าเต็มหรือยัง (ใช้ <= 0 เพื่อความชัวร์)
    const isFullOnline = event.max_online - event.current_online <= 0;
    const isFullWalkIn = event.max_walk_in - event.current_walk_in <= 0;

    if (isFullOnline && isFullWalkIn) {
      return {
        label: "Class is full",
        color: "bg-[#f1e9df] text-[#8e7457]",
        disabled: true,
        btnText: "Fully booked",
      };
    }

    return {
      label: "Open for booking",
      color: "bg-[#e8eddd] text-[#65734f]",
      disabled: false,
      btnText: "Book now",
    };
  };

  const changeMonth = (month: Date) => {
    setLoading(true);
    setError(false);
    setRoundCourseMonth([]);
    setCurrentMonth(month);
    setSelectedDate(isSameMonth(month, new Date()) ? new Date() : startOfMonth(month));
  };
  const prevMonth = () => changeMonth(subMonths(currentMonth, 1));
  const nextMonth = () => changeMonth(addMonths(currentMonth, 1));

  const roundCourse = useMemo(() => roundCourseMonth.filter((course) =>
    isSameDay(new Date(course.startDateTime), selectedDate),
  ), [roundCourseMonth, selectedDate]);

  useEffect(() => {
    let active = true;
    courseService.getRoundToDay({ month: format(currentMonth, "yyyy-MM") })
      .then((response) => {
        if (active) setRoundCourseMonth(Array.isArray(response?.data) ? response.data : []);
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [currentMonth]);

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-normal text-[#858d79] py-3"
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
              <button
                type="button"
                key={day.toString()}
                aria-pressed={isSelected}
                aria-current={isToday ? "date" : undefined}
                aria-label={`${format(day, "d MMMM yyyy", { locale: enGB })}${hasEvents ? ` with ${dailyCourses.length} classes` : ""}`}
                disabled={!isCurrentMonth}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative min-w-0 h-14 md:h-24 border rounded-sm flex flex-col items-start justify-start p-2 text-left cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#788461] disabled:cursor-default
                  ${!isCurrentMonth ? "bg-[#f1f2ec] text-[#a2a895]" : "bg-[#fffefa] text-[#58634a]"}
                  ${isSelected ? "border-[#788461]! bg-[#e8eddd]! ring-1 ring-[#788461]" : "border-[#e4e7db] enabled:hover:border-[#a9b594] enabled:hover:bg-[#f0f2e9]"}
                `}
              >
                <span
                  className={`text-sm font-medium ${isToday ? "bg-[#626d4f] text-[#fffef5] w-6 h-6 rounded-full flex items-center justify-center" : ""}`}
                >
                  {format(day, "d")}
                </span>

                {hasEvents && (
                  <div className="mt-1 w-full overflow-hidden">
                    <div className="hidden md:block text-[10px] md:text-xs truncate text-[#65734f] bg-[#e8eddd] px-1 rounded mb-0.5">
                      {dailyCourses[0].course.title}
                    </div>
                    {dailyCourses.length > 1 && (
                      <div className="hidden md:block text-[10px] text-[#858d79] pl-1">
                        + {dailyCourses.length - 1} courses
                      </div>
                    )}
                    <div className="md:hidden flex justify-center gap-0.5 mt-1">
                      {dailyCourses.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-[#8c9778] rounded-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#fffefa] rounded-md border border-[#dedfd4]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-normal text-[#454d39] flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-[#737f5f]" />
          {format(currentMonth, "MMMM yyyy", { locale: enGB })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous month"
            onClick={prevMonth}
            className="size-10 rounded-full bg-transparent hover:bg-[#eef0e5] border border-[#d5dcc7] shadow-none transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#737f5f]" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next month"
            onClick={nextMonth}
            className="size-10 rounded-full bg-transparent hover:bg-[#eef0e5] border border-[#d5dcc7] shadow-none transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#737f5f]" />
          </Button>
        </div>
      </div>

      {renderCells()}

      {/* Details Section */}
      <div className="mt-8 border-t border-[#dedfd4] pt-6">
        <h3 className="text-base font-normal text-[#454d39] mb-5 flex flex-wrap items-center gap-2">
          Classes for{" "}
          <span className="text-[#737f5f]">
            {format(selectedDate, "d MMMM yyyy", { locale: enGB })}
          </span>
        </h3>

        {loading ? (
          <div role="status" className="flex items-center justify-center gap-3 py-10 text-sm text-[#737f5f]">
            <span>Loading the timetable…</span>
            <Loader2 className="w-8 h-8 text-[#737f5f] animate-spin" />
          </div>
        ) : error ? (
          <p role="alert" className="rounded-sm border border-[#e2d7c9] bg-[#f5f0e8] px-5 py-10 text-center text-sm text-[#8e7457]">Unable to load the timetable. Please try again later.</p>
        ) : roundCourse.length > 0 ? (
          <div className="space-y-4">
            {roundCourse.map((event) => {
              const status = getEventStatus(event); // เรียกใช้ Logic สถานะ
              const start = new Date(event.startDateTime);
              const end = new Date(event.endDateTime);
              const diffInMinutes = differenceInMinutes(end, start);
              const formattedDuration =
                `${Math.floor(diffInMinutes / 60) > 0 ? `${Math.floor(diffInMinutes / 60)} hr ` : ""}${diffInMinutes % 60 > 0 ? `${diffInMinutes % 60} min` : ""}`.trim();

              return (
                <div
                  key={event.id}
                  className="relative flex flex-col sm:flex-row items-start gap-5 p-4 md:p-5 bg-[#fafbf5] rounded-md border border-[#e1e5d7] hover:border-[#bbc6aa] transition-colors duration-200"
                >
                  {/* Status Badge */}
                  <div
                    className={`absolute top-6 sm:top-20 right-6 text-[10px] font-normal px-2.5 py-1 rounded-sm z-10 ${status.color}`}
                  >
                    {status.label}
                  </div>

                  <div className="relative shrink-0 w-full sm:w-[120px] aspect-video sm:aspect-square rounded-sm border border-[#dedfd4] overflow-hidden bg-[#e9ecdf]">
                    <Image
                      src={imageUrl(event.course.cover_image)}
                      alt={event.course.title}
                      sizes="(min-width: 640px) 120px, 90vw"
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 md:gap-4">
                      <h4 className="text-base md:text-lg font-medium text-[#454d39] line-clamp-1">
                        {event.course.title}
                      </h4>
                      <span className="text-xs font-normal text-[#737f5f] bg-[#edf1e4] px-2 py-1 rounded-md whitespace-nowrap">
                        Starts: {format(start, "HH:mm")}
                      </span>
                    </div>

                    <p className="text-sm text-[#73766b] mt-2 sm:pr-24 line-clamp-2 leading-relaxed">
                      {event.course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-[#73766b]">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Instructor:</span>{" "}
                        {event.course.teacher.userInfo.firstName}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Duration:</span>{" "}
                        {formattedDuration}
                      </div>

                      {/* Slots Online */}
                      <div
                        className={`flex items-center gap-1 ${event.max_online - event.current_online <= 0 ? "text-[#9a8063]" : ""}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${event.max_online - event.current_online <= 0 ? "bg-[#b09c82]" : "bg-[#8c9778]"}`}
                        ></span>
                        Online:{" "}
                        {event.max_online - event.current_online <= 0
                          ? "Full"
                          : event.max_online - event.current_online}
                      </div>

                      {/* Slots Walk-in */}
                      <div
                        className={`flex items-center gap-1 ${event.max_walk_in - event.current_walk_in <= 0 ? "text-[#9a8063]" : ""}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${event.max_walk_in - event.current_walk_in <= 0 ? "bg-[#b09c82]" : "bg-[#b9aa7e]"}`}
                        ></span>
                        Walk-in:{" "}
                        {event.max_walk_in - event.current_walk_in <= 0
                          ? "Full"
                          : event.max_walk_in - event.current_walk_in}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#dedfd4]">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#858d79] mb-0.5">
                          Price per person
                        </span>
                        <div className="flex items-baseline gap-2">
                          {event.course.discount_price ? (
                            <>
                              <span className="text-2xl font-serif font-normal text-[#454d39]">
                                ฿{event.course.discount_price.toLocaleString()}
                              </span>
                              <span className="text-xs font-normal text-[#858d79] line-through">
                                ฿{event.course.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-serif font-normal text-[#454d39]">
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
                        className={`h-10 rounded-sm px-6 text-xs font-normal shadow-none transition-colors ${status.disabled ? "bg-[#e4e8db] text-[#858d79]" : "bg-[#48533b] text-[#fffef5] hover:bg-[#303c26]"}`}
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
          <div className="text-center py-12 bg-[#f5f6ef] rounded-sm border border-[#dedfd4]">
            <p className="text-[#858d79] text-sm font-normal">No classes scheduled for this date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
