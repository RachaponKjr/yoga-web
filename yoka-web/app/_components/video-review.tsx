/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { videoService } from "@/service/video.service";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";

// Import Swiper React components และ Styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface VideoType {
  id: string;
  url_1: string;
  url_2: string;
  url_3: string;
  url_4: string;
}

const VideoReview = () => {
  const [video, setVideo] = useState<VideoType>();
  const handleGetVideo = async () => {
    try {
      const data = await videoService.getAll();
      console.log(data);
      setVideo(data);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    handleGetVideo();
  }, []);

  if (!video) return null;

  const videoList = [video.url_1, video.url_2, video.url_3, video.url_4];

  return (
    <div className="container mx-auto py-12 px-4 bg-red-500">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={24} // ระยะห่างระหว่างวิดีโอ
        slidesPerView={1.3} // เริ่มต้นที่ 1 อันในมือถือ
        navigation={true} // เพิ่มปุ่มซ้าย-ขวา
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          // เมื่อจอใหญ่ขึ้น ให้แสดงจำนวนอันเพิ่มขึ้น
          640: { slidesPerView: 2.3 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-12 overflow-visible!" // ปรับเพื่อให้เงาของ Card ไม่โดนตัด
      >
        {videoList.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="group relative w-full aspect-12/16 rounded-3xl overflow-hidden bg-black cursor-pointer shadow-lg transition-all duration-500 hover:-translate-y-2">
              {/* 1. ตัววิดีโอ */}
              <iframe
                src={`${url}${url.endsWith("/") ? "" : "/"}embed`}
                className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                style={{
                  transform: "scale(1.3)",
                  marginTop: "-10%",
                }}
                frameBorder="0"
                scrolling="no"
              ></iframe>

              {/* 2. Overlay ปุ่ม Play */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white/50 transition-all duration-300">
                  <Play className="text-white fill-white" size={28} />
                </div>
              </div>

              {/* 3. Gradient ด้านล่าง */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles สำหรับแต่งปุ่ม Swiper ให้เข้ากับธีม */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #f87171 !important; /* สีแดง red-400 */
          background: white;
          width: 45px !important;
          height: 45px !important;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transform: scale(0.7);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet-active {
          background: #f87171 !important;
        }
      `}</style>
    </div>
  );
};

export default VideoReview;
