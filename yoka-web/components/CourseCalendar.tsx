"use client";
import { RoundCourseType } from "@/types/course.type";
import React, { useState, useMemo, useEffect } from "react";

interface CourseCalendarProps {
  rounds: RoundCourseType[];
  // รับค่าวันที่ที่เลือกจาก Parent Component
  selectedDate?: Date;
  onDateSelect?: (date: Date, roundsOnDate: RoundCourseType[]) => void;
}

const CourseCalendar: React.FC<CourseCalendarProps> = ({
  rounds,
  selectedDate: externalSelectedDate, // ตั้งชื่อใหม่เพื่อไม่ให้สับสนกับ state ภายใน
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // เดือนที่กำลังดูอยู่
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(
    null
  ); // วันที่ถูกเลือก (State ภายใน)

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

  // --- 1. Effect: Sync กับ Prop จากภายนอก (สำคัญมาก) ---
  useEffect(() => {
    if (externalSelectedDate) {
      setInternalSelectedDate(externalSelectedDate);
      // เปลี่ยนหน้าปฏิทินไปเดือนของวันที่เลือกด้วย เพื่อให้ User ไม่หลง
      setCurrentDate(new Date(externalSelectedDate));
    }
  }, [externalSelectedDate]);

  // --- 2. Effect: Initial Load (Fallback กรณีไม่มี Prop ส่งมา) ---
  useEffect(() => {
    // ถ้ามี Prop ส่งมาแล้ว ไม่ต้องทำ Auto-select เอง
    if (externalSelectedDate) return;

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
        setInternalSelectedDate(targetDate);

        if (onDateSelect) {
          const roundsOnThisDate = rounds.filter((r) =>
            isSameDay(new Date(r.startDateTime), targetDate)
          );
          onDateSelect(targetDate, roundsOnThisDate);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rounds]); // ตัด dependency externalSelectedDate ออกเพื่อป้องกัน loop

  // 3. Map วันที่มีกิจกรรม
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
    if (date < today) return;
    if (!hasEvent) return;

    // อัปเดต state ภายในทันทีเพื่อให้ UI ลื่นไหล
    setInternalSelectedDate(date);

    // ส่งค่ากลับไปหา Parent
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
    <div className="w-full  md:max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer"
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
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer"
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

          // ใช้ internalSelectedDate ในการเช็คว่าวันไหนถูกเลือก
          const isSelected = internalSelectedDate
            ? isSameDay(loopDate, internalSelectedDate)
            : false;

          return (
            <div
              key={day}
              onClick={() => handleDayClick(loopDate, hasEvent)}
              className={`
                h-10 flex flex-col items-center justify-center rounded-lg relative transition-all border border-transparent
                ${
                  isPast
                    ? "text-slate-300 cursor-not-allowed"
                    : "hover:bg-emerald-100 hover:text-emerald-600 "
                }
                ${
                  isPast
                    ? ""
                    : isSelected
                      ? "bg-emerald-600 text-white shadow-md cursor-pointer scale-105"
                      : hasEvent
                        ? "cursor-pointer text-slate-700 font-medium bg-emerald-50" // เพิ่มสีพื้นจางๆ ให้วันที่เรียน
                        : "cursor-default text-slate-400"
                }
                ${
                  !isSelected && isCurrentDay && !isPast
                    ? "border-emerald-200 text-emerald-600 font-bold border"
                    : ""
                }
              `}
            >
              <span className="text-sm z-10">{day}</span>

              {/* --- จุด (Dot) --- */}
              {hasEvent && (
                <span
                  className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                    isSelected
                      ? "bg-white"
                      : isPast
                        ? "bg-emerald-200"
                        : "bg-emerald-500 animate-pulse"
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
