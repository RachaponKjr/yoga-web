"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import reviewData from "@/assets/yoga_by_niti_reviews.json";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function ReviewSection() {
  return (
    <section className="overflow-visible relative py-0">
      <div className="container mx-auto px-4 overflow-visible">
        {/* Header Section */}
        <div className="flex flex-row md:flex-row  justify-between items-end gap-2 md:gap-6 md:mb-4">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#606C38] font-bold tracking-[0.2em] uppercase text-xs block mb-3"
            >
              Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-extrabold text-[#283618] leading-tight"
            >
              เสียงจาก <span className="italic opacity-80">ความประทับใจ</span>{" "}
              <br />
              ของคนรักสุขภาพ
            </motion.h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pb-2">
            <button className="review-prev w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#283618] hover:border-[#283618] hover:text-white transition-all duration-300 shadow-sm active:scale-95">
              <ChevronLeft size={24} />
            </button>
            <button className="review-next w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#283618] hover:border-[#283618] hover:text-white transition-all duration-300 shadow-sm active:scale-95">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Swiper Carousel */}
        <div className="relative overflow-hidden">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.5}
            loop={true}
            // เพิ่ม h-full ให้กับ swiper-wrapper
            className="p-6! -m-6! overflow-visible"
            navigation={{
              prevEl: ".review-prev",
              nextEl: ".review-next",
            }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              1024: { slidesPerView: 2.5 },
              1280: { slidesPerView: 3 },
            }}
          >
            {reviewData.map((item, index) => (
              // ใส่ !h-auto เพื่อให้ Swiper Slide ยอมขยายตามเพื่อนในแนวตั้ง
              <SwiperSlide key={index} className="h-auto! py-4">
                <div className="bg-white p-4 md:p-8 rounded-xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col h-full">
                  {/* Content Wrapper - flex-1 จะช่วยดันส่วนล่างให้เท่ากัน */}
                  <div className="flex-1">
                    <div className="hidden w-12 h-12 bg-[#FEFAE0] rounded-2xl md:flex items-center justify-center mb-4 text-[#283618]">
                      <Quote
                        size={24}
                        fill="currentColor"
                        className="opacity-40"
                      />
                    </div>

                    <div className="flex gap-0.5 mb-2 md:mb-4 text-[#DDA15E]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="md:w-4 md:h-4 w-3 h-3 fill-current"
                        />
                      ))}
                    </div>

                    <p className="text-[#5C6155] text-[10px] md:text-lg leading-relaxed line-clamp-3 font-medium italic md:mb-4">
                      &quot;
                      {item.content ||
                        "An incredible experience for body and mind."}
                      &quot;
                    </p>
                  </div>

                  {/* Profile Section - ติดอยู่ด้านล่างสุดเสมอ */}
                  <div className="flex items-center gap-4 border-t pt-2 md:pt-0 border-gray-50 mt-auto">
                    <div className="relative w-8 h-8 md:w-14 md:h-14 rounded-full overflow-hidden ring-4 ring-[#FEFAE0] shrink-0">
                      <Image
                        src={item.avatarUrl || item.avatarUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm  md:text-base font-bold text-[#283618]">
                        {item.name}
                      </h4>
                      <p className="text-[8px] text-gray-400">
                        Google Reviewer
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .swiper {
          overflow: visible !important;
        }
        /* ดึงให้ทุกสไลด์มีความสูงเท่ากัน */
        .swiper-wrapper {
          display: flex;
        }
      `}</style>
    </section>
  );
}
