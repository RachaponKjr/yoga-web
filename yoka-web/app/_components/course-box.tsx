"use client";

import React from "react";
import ProductItem from "@/components/layout/product-item";
import { courseService } from "@/service/course.service";
import { CourseType, PaginationType } from "@/types/course.type";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// 1. Import Swiper และ Modules ที่จำเป็น
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// 2. Import CSS ของ Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CourseRes {
  data: {
    courses: CourseType[];
    pagination: PaginationType;
  };
}

const CourseBox = () => {
  const { data: courses, isLoading } = useQuery<CourseRes>({
    queryKey: ["courses"],
    queryFn: () => courseService.getCourseAll(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="w-full relative px-4 md:px-0">
      <Swiper
        // 3. กำหนด Modules ที่จะใช้
        modules={[Navigation, Pagination, Autoplay]}
        // 4. การตั้งค่าพื้นฐาน
        spaceBetween={20} // ระยะห่างระหว่างการ์ด (px)
        slidesPerView={1} // ค่าเริ่มต้น (มือถือ) โชว์ 1 รูป
        navigation={true} // แสดงลูกศร ซ้าย-ขวา
        pagination={{ clickable: true, dynamicBullets: true }} // จุดด้านล่าง
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        // 5. Responsive Breakpoints (หัวใจสำคัญ)
        breakpoints={{
          640: {
            slidesPerView: 2, // Tablet แนวตั้ง หรือมือถือจอใหญ่
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3, // Tablet แนวนอน หรือ Laptop เล็ก
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4, // Desktop ปกติ
            spaceBetween: 24,
          },
        }}
        className="w-full pb-12" // pb-12 เผื่อที่ให้ Pagination dots ด้านล่างไม่ทับการ์ด
      >
        {courses?.data?.courses?.map((course: CourseType, index: number) => (
          // ใช้ SwiperSlide ครอบ ProductItem
          <SwiperSlide key={index} className="h-auto">
            <div className="h-full">
              <ProductItem course={course} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ถ้าต้องการปรับแต่ง CSS ของปุ่มลูกศร Swiper เพิ่มเติม สามารถเขียน style global หรือ css module ทับได้ */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #059669; /* สี Emerald-600 */
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .swiper-pagination-bullet-active {
          background-color: #059669;
        }
      `}</style>
    </div>
  );
};

export default CourseBox;
