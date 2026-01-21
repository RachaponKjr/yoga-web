"use client";

import UserCardGlass from "@/components/layout/user-card";
import { Button } from "@/components/ui/button";
import { UserInfoType, UserType } from "@/types/auth.type";
import Link from "next/link";
import React, { useRef } from "react";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules"; // เปลี่ยน Pagination เป็น Navigation
import { Swiper as SwiperType } from "swiper";

// Import Styles
import "swiper/css";
import { ArrowLeft, ArrowRight, MoveRight } from "lucide-react"; // ใช้ Lucide icons ให้ดู modern

interface InstructorProps extends UserType {
  userInfo: UserInfoType;
}

const Instructors = ({ data }: { data: InstructorProps[] }) => {
  // สร้าง Ref เพื่อคุม Swiper จากปุ่มด้านนอก
  const swiperRef = useRef<SwiperType>();

  return (
    <section className="relative bg-[#283618] py-20 overflow-hidden">
      {/* Background Decor (Optional: ทำให้ดูมีมิติขึ้นแบบ Minimal) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* --- Header Section: Title Left / Arrows Right --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4 max-w-2xl">
            <span className="text-emerald-400/80 uppercase tracking-[0.2em] text-xs font-bold">
              Our Experts
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#FEFAE0] leading-tight">
              Meet Your <br />
              <span className="text-white">Instructors</span>
            </h2>
            <p className="text-[#FEFAE0]/60 font-light text-base md:text-lg max-w-md leading-relaxed">
              Experience guidance from world-class professionals dedicated to
              your wellness journey.
            </p>
          </div>

          {/* Custom Navigation Buttons (Minimal Style) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="group p-4 rounded-full border border-white/10 hover:bg-[#FEFAE0] hover:border-[#FEFAE0] transition-all duration-300"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5 text-[#FEFAE0] group-hover:text-[#283618] transition-colors" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="group p-4 rounded-full border border-white/10 hover:bg-[#FEFAE0] hover:border-[#FEFAE0] transition-all duration-300"
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5 text-[#FEFAE0] group-hover:text-[#283618] transition-colors" />
            </button>
          </div>
        </div>

        {/* --- Swiper Section --- */}
        <div className="w-full">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1.2}
            loop={true}
            speed={800} // เลื่อนนุ่มๆ
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 2.5, spaceBetween: 24 },
              1024: { slidesPerView: 3.5, spaceBetween: 30 },
              1280: { slidesPerView: 4, spaceBetween: 32 },
            }}
            className="overflow-visible!" // Trick: ให้การ์ดไหลออกนอก Container ได้ ดูพรีเมียม
          >
            {data.length === 0 ? (
              <div className="py-20 text-center w-full">
                <p className="text-[#FEFAE0]/50 font-light">
                  No instructors available at the moment.
                </p>
              </div>
            ) : (
              data.map((item) => (
                <SwiperSlide key={item.id} className="h-auto py-4 pl-1">
                  {/* Hover Effect Wrapper */}
                  <div className="h-full transition-transform duration-500 hover:-translate-y-2">
                    <UserCardGlass
                      fullName={
                        item.userInfo.firstName
                          ? `${item.userInfo.firstName} ${
                              item.userInfo.lastName || ""
                            }`.trim()
                          : item.email
                      }
                      avatar={item.userInfo.avatar || ""}
                      facebook={item.userInfo.facebook || ""}
                      instagram={item.userInfo.instagram || ""}
                      twitter={item.userInfo.twitter || ""}
                    />
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>

        {/* --- Footer / Mobile Nav --- */}
        <div className="mt-12 flex flex-col items-center gap-6">
          {/* Mobile Navigation (Show only on small screens) */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-[#FEFAE0] transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-[#FEFAE0] transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Minimal View All Button */}
          <Button
            asChild
            variant="link"
            className="text-[#FEFAE0] hover:text-white transition-all bg-[#FEFAE0]/10 hover:bg-[#FEFAE0]/20 py-6 px-10 rounded-full group"
          >
            <Link
              href="/instructors"
              className="flex items-center gap-2 text-lg font-light tracking-wide"
            >
              View All Instructors
              <span className="bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 transition-all group-hover:translate-x-1">
                <MoveRight className="w-4 h-4" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Instructors;
