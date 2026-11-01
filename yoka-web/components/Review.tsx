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
              className="text-[#737b62] font-normal tracking-[0.22em] uppercase text-[10px] block mb-3"
            >
              Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-normal text-[#30372c] leading-[1.3] tracking-[-0.025em]"
            >
              เสียงจาก <span className="italic opacity-80">ความประทับใจ</span>{" "}
              <br />
              ของคนรักสุขภาพ
            </motion.h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pb-2">
            <button aria-label="Previous review" className="review-prev w-12 h-12 rounded-full border border-[#d5dcc7] flex items-center justify-center text-[#737f5f] hover:bg-[#48533b] hover:border-[#48533b] hover:text-[#fffef5] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#788461]">
              <ChevronLeft size={24} />
            </button>
            <button aria-label="Next review" className="review-next w-12 h-12 rounded-full border border-[#d5dcc7] flex items-center justify-center text-[#737f5f] hover:bg-[#48533b] hover:border-[#48533b] hover:text-[#fffef5] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#788461]">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Swiper Carousel */}
        <div className="relative overflow-visible">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.5}
            loop={true}
            // เพิ่ม h-full ให้กับ swiper-wrapper
            className="p-6! -m-6! overflow-visible!"
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
                <div className="bg-[#fffefa] p-4 md:p-8 rounded-md border border-[#dedfd4] hover:border-[#b9c3a6] transition-colors duration-300 flex flex-col h-full">
                  {/* Content Wrapper - flex-1 จะช่วยดันส่วนล่างให้เท่ากัน */}
                  <div className="flex-1">
                    <div className="hidden w-12 h-12 bg-[#eff1e7] rounded-sm md:flex items-center justify-center mb-4 text-[#454d39]">
                      <Quote
                        size={24}
                        fill="currentColor"
                        className="opacity-40"
                      />
                    </div>

                    <div className="flex gap-0.5 mb-2 md:mb-4 text-[#a69a70]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="md:w-4 md:h-4 w-3 h-3 fill-current"
                        />
                      ))}
                    </div>

                    <p className="text-[#73766b] text-xs md:text-base leading-[1.9] line-clamp-3 font-normal italic md:mb-4">
                      &quot;
                      {item.content ||
                        "An incredible experience for body and mind."}
                      &quot;
                    </p>
                  </div>

                  {/* Profile Section - ติดอยู่ด้านล่างสุดเสมอ */}
                  <div className="flex items-center gap-4 border-t pt-2 md:pt-0 border-[#e7e9df] mt-auto">
                    <div className="relative w-8 h-8 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-[#e7ebdd] shrink-0">
                      <Image
                        src={item.avatarUrl || item.avatarUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-medium text-[#454d39]">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#858d79]">
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
    </section>
  );
}
