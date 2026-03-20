"use client";

import React from "react";
import ProductItem from "@/components/layout/product-item";
import { courseService } from "@/service/course.service";
import { CourseType, PaginationType } from "@/types/course.type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import CSS
import "swiper/css";

// Type ของ Response
interface CourseRes {
  courses: CourseType[];
  pagination: PaginationType;
  // เช็คดูว่าโครงสร้างจริง data ซ้อน data หรือไม่ (API ปกติมักจะเป็น { data: { courses: ... } } หรือ { courses: ... } เลย)
  // แต่จากโค้ดเดิมคุณใช้ courses?.data?.courses ผมจะยึดตามนั้น
}

const CourseBox = () => {
  // 1. ดึงข้อมูล
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await courseService.getCourseAll();
      return res; // ตรวจสอบว่า service return อะไรออกมา
    },
  });

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // 3. Extract และ Filter ข้อมูล
  // สมมติว่า apiResponse มี structure คือ { data: { courses: [...] } } ตามโค้ดเดิม
  // ป้องกัน undefined ด้วย ?. และ || []
  const allCourses = apiResponse?.data?.courses || [];

  // กรองเฉพาะคอร์สที่ isShow เป็น true (หรือไม่ได้กำหนดว่าเป็น false)
  const activeCourses = allCourses.filter(
    (course: CourseType) => course.isShow !== false,
  );

  // 4. Empty State (ถ้าไม่มีคอร์ส หรือคอร์สถูกปิดหมด)
  if (activeCourses.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <p className="text-gray-500">ไม่พบคอร์สที่เปิดใช้งาน</p>
      </div>
    );
  }

  return (
    <div className="w-full relative md:px-0">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1.2} // ในมือถือให้เห็นขอบรูปถัดไปนิดนึง (User Experience ดีกว่า)
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="w-full pb-12 !px-2" // เพิ่ม padding แนวนอนนิดหน่อยเพื่อไม่ให้ shadow ขาด
      >
        {/* ใช้ activeCourses ที่กรองแล้วมา map */}
        {activeCourses.map((course: CourseType, index: number) => (
          <SwiperSlide key={course.id || index} className="h-auto py-2">
            <div className="h-auto">
              <ProductItem course={course} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CourseBox;
