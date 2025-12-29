"use client";
import { RoundCourseType } from "@/types/course.type";
import React, { useState, useMemo, useEffect } from "react";

interface CourseCalendarProps {
  rounds: RoundCourseType[];
  onDateSelect?: (date: Date, roundsOnDate: RoundCourseType[]) => void;
}

const CourseCalendar: React.FC<CourseCalendarProps> = ({
  rounds,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Helper: วันนี้ (00:00:00)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // 1. Initial Load: หา "รอบแรกสุด" ในอนาคต แล้วเลือกให้อัตโนมัติ
  useEffect(() => {
    if (rounds.length > 0) {
      const sortedRounds = [...rounds].sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime()
      );

      const firstRound = sortedRounds.find((r) => {
        const rDate = new Date(r.startDateTime);
        rDate.setHours(0, 0, 0, 0);
        return rDate >= today;
      });

      if (firstRound) {
        const targetDate = new Date(firstRound.startDateTime);
        setCurrentDate(new Date(targetDate));
        setSelectedDate(targetDate);

        if (onDateSelect) {
          const roundsOnThisDate = rounds.filter((r) =>
            isSameDay(new Date(r.startDateTime), targetDate)
          );
          onDateSelect(targetDate, roundsOnThisDate);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rounds]);

  // 2. Map วันที่มีกิจกรรม
  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    rounds.forEach((round) => {
      const date = new Date(round.startDateTime);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      dates.add(dateKey);
    });
    return dates;
  }, [rounds]);

  // ฟังก์ชันกดเลือกวัน
  const handleDayClick = (date: Date, hasEvent: boolean) => {
    // 1. ห้ามกดวันอดีต
    if (date < today) return;

    // 2. ห้ามกดถ้าไม่มี Event (แม้จะมี Hover ก็ตาม)
    if (!hasEvent) return;

    setSelectedDate(date);

    if (onDateSelect) {
      const roundsOnThisDate = rounds.filter((r) =>
        isSameDay(new Date(r.startDateTime), date)
      );
      onDateSelect(date, roundsOnThisDate);
    }
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const startDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const changeMonth = (increment: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* --- Grid Header --- */}
      <div className="grid grid-cols-7 text-center mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-xs font-semibold text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* --- Grid Body --- */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const loopDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );

          const dateKey = `${loopDate.getFullYear()}-${loopDate.getMonth()}-${day}`;
          const hasEvent = eventDates.has(dateKey);

          const isPast = loopDate < today;
          const isCurrentDay = isSameDay(loopDate, today);
          const isSelected = selectedDate
            ? isSameDay(loopDate, selectedDate)
            : false;

          return (
            <div
              key={day}
              onClick={() => handleDayClick(loopDate, hasEvent)}
              className={`
                h-10 flex flex-col items-center justify-center rounded-lg relative transition-all border border-transparent
                ${
                  isPast
                    ? "text-slate-300 cursor-not-allowed" // อดีต: จาง ไม่ Hover
                    : "hover:bg-emerald-100 hover:text-emerald-600 " // อนาคต/วันนี้: มี Hover Effect ทุกตัว (ตามโจทย์)
                }
                ${
                  // Style เพิ่มเติม แยกตามเงื่อนไข
                  isPast
                    ? ""
                    : isSelected
                    ? "bg-emerald-600 text-white shadow-md cursor-pointer scale-105" // ถูกเลือก
                    : hasEvent
                    ? "cursor-pointer text-slate-700" // มีกิจกรรม: กดได้ (Pointer)
                    : "cursor-default text-slate-400" // ไม่มีกิจกรรม: กดไม่ได้ (Default Cursor) แต่มี Hover จากข้างบน
                }
                ${
                  // วันนี้ (ถ้าไม่ได้ถูกเลือก) ให้ใส่กรอบหรือสีพื้นจางๆ หน่อย
                  !isSelected && isCurrentDay && !isPast
                    ? "bg-emerald-100 text-emerald-600 font-bold"
                    : ""
                }
              `}
            >
              <span className="text-sm z-10">{day}</span>

              {/* --- จุด (Dot) --- */}
              {hasEvent && (
                <span
                  className={`absolute bottom-1 animate-pulse w-1.5 h-1.5 rounded-full ${
                    isSelected
                      ? "bg-white"
                      : isPast
                      ? "bg-emerald-200"
                      : "bg-emerald-500"
                  }`}
                ></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseCalendar;
