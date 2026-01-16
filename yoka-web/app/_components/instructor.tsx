"use client"; // จำเป็นต้องใส่เพราะ Swiper เป็น Client Component

import UserCardGlass from "@/components/layout/user-card";
import { Button } from "@/components/ui/button";
import { UserInfoType, UserType } from "@/types/auth.type";
import Link from "next/link";
import React from "react";

// Import Swiper และ Modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import { Icon } from "@iconify/react";

interface InstructorProps extends UserType {
  userInfo: UserInfoType;
}

const Instructors = ({ data }: { data: InstructorProps[] }) => {
  return (
    <div className="bg-[#283618] py-0 md:py-20 px-4 md:px-0">
      <div className="flex flex-col gap-8 items-center container mx-auto">
        {/* --- ส่วน Header (เหมือนเดิม) --- */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12 w-full">
          <div className="flex flex-col gap-2 max-w-2xl w-full lg:w-max">
            <h4 className="text-3xl md:text-4xl font-serif font-semibold text-secondary">
              Yoga Instructors
            </h4>
            <p className="text-secondary/80 font-medium text-sm md:text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className="hidden lg:flex flex-row justify-center items-center gap-8 w-full">
            <div className="w-full h-px bg-white/60" />
            <div className="border border-white/60 rounded-full p-2 shrink-0">
              <div className="w-3 aspect-square rounded-full bg-white animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* --- ส่วน Slider (Swiper) --- */}
        <div className="w-full">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20} // ระยะห่างระหว่างการ์ด (px)
            slidesPerView={1} // ค่าเริ่มต้น (มือถือ)
            loop={true} // วนลูปสไลด์
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true, // ทำให้จุดไข่ปลาดูสวยขึ้นเวลามีหน้าเยอะๆ
            }}
            // กำหนดจำนวนการ์ดที่จะแสดงในแต่ละหน้าจอ (แทน Grid)
            breakpoints={{
              640: {
                slidesPerView: 2, // มือถือแนวนอน/แท็บเล็ตเล็ก
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3, // แท็บเล็ต
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4, // แล็ปท็อป
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 5, // จอใหญ่
                spaceBetween: 24,
              },
            }}
            className="w-full pb-14" // เพิ่ม padding ด้านล่างเพื่อให้จุด Pagination ไม่ทับการ์ด
          >
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-secondary/80 font-medium text-sm md:text-base">
                  No instructors found.
                </p>
              </div>
            ) : (
              data.map((item) => (
                <SwiperSlide key={item.id} className="h-auto">
                  <div className="h-full flex">
                    <UserCardGlass
                      fullName={
                        item.userInfo.firstName
                          ? `${item.userInfo.firstName} ${item.userInfo.lastName || ""}`.trim()
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

        {/* --- ปุ่ม View All --- */}
        {/* <Button
          className="text-white rounded-full cursor-pointer bg-[#3D552F] hover:bg-[#3D552F] w-full sm:w-auto"
          size={"lg"}
          asChild
        >
          <Link
            href="/instructors"
            className="flex items-center justify-center"
          >
            View All
          </Link>
        </Button> */}
        <Button
          asChild
          size={"lg"}
          className="rounded-full bg-[#132B28] hover:bg-[#3D552F] w-full text-white px-10 h-14 text-base shadow-xl shadow-[#132B28]/20 transition-all hover:scale-105 hover:shadow-2xl"
        >
          <Link href="/instructors" className="flex items-center  gap-3">
            View All
            <div className="bg-white/20 rounded-full p-1">
              <Icon icon="mdi:arrow-right" className="w-4 h-4" />
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Instructors;
