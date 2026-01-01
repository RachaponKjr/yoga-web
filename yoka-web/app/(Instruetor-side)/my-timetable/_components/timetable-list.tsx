import CalendarAddTime from "@/components/layout/calendar-add-time";
import { CalendarRange, Clock, Sparkles } from "lucide-react";
import React from "react";

const TimeTableList = () => {
  return (
    <div className="min-h-max pt-32 pb-20">
      <div className="container mx-auto  max-w-6xl">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-3 h-3" />
              Instructor Portal
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Manage Schedule
            </h1>

            {/* Description */}
            <p className="text-gray-500 max-w-lg text-base md:text-lg font-light leading-relaxed">
              Organize your yoga sessions and update availability for upcoming
              classes effortlessly.
            </p>
          </div>

          {/* Time Zone Badge (Minimal Style) */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm hover:shadow-md transition-all duration-300">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium">Asia/Bangkok</span>
          </div>
        </div>

        {/* --- Main Content --- */}
        {/* ใช้ Card สีขาวสะอาด มุมโค้งมน พร้อมเงาฟุ้งๆ (Soft Shadow) */}
        <CalendarAddTime />
      </div>
    </div>
  );
};

export default TimeTableList;
