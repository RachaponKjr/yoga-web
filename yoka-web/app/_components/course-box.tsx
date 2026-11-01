"use client";

import React from "react";
import ProductItem from "@/components/layout/product-item";
import { courseService } from "@/service/course.service";
import { CourseType } from "@/types/course.type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import CSS
import "swiper/css";

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
        <Loader2 className="w-8 h-8 animate-spin text-[#788461]" />
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
        <p className="text-[#73766b]">No courses are currently available</p>
      </div>
    );
  }

  return (
    <div className="w-full relative md:px-0">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={12}
        slidesPerView={1.4} // ในมือถือให้เห็นขอบรูปถัดไปนิดนึง (User Experience ดีกว่า)
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
        className="w-full pb-12 !px-2 overflow-visible!" // เพิ่ม padding แนวนอนนิดหน่อยเพื่อไม่ให้ shadow ขาด
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
