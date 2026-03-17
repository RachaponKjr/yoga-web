/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { videoService } from "@/service/video.service";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
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

// --- คอมโพเนนต์ย่อยสำหรับแต่ละ Slide ---
const VideoSlide = ({ url }: { url: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // สร้าง URL สำหรับเล่นอัตโนมัติเมื่อกด
  const videoSrc = isPlaying
    ? `${url}${url.endsWith("/") ? "" : "/"}embed/?autoplay=1`
    : `${url}${url.endsWith("/") ? "" : "/"}embed`;

  return (
    <div
      className="group relative w-full aspect-12/16 rounded-3xl overflow-hidden bg-black cursor-pointer shadow-lg transition-all duration-500"
      onClick={() => setIsPlaying(true)}
    >
      {/* 1. ตัววิดีโอ */}
      <iframe
        src={videoSrc}
        className={`w-full h-full transition-transform duration-500 ${!isPlaying ? "group-hover:scale-105 pointer-events-none" : "pointer-events-auto"}`}
        style={{
          transform: "scale(1.3)",
          marginTop: "-10%",
        }}
        frameBorder="0"
        scrolling="no"
      ></iframe>

      {/* 2. Overlay ปุ่ม Play */}
      {!isPlaying && (
        <>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white/50 transition-all duration-300 shadow-xl">
              <Play className="text-white fill-white" size={28} />
            </div>
          </div>

          {/* 3. Gradient ด้านล่าง */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      )}
    </div>
  );
};

const VideoReview = () => {
  const [video, setVideo] = useState<VideoType>();

  const handleGetVideo = async () => {
    try {
      const data = await videoService.getAll();
      setVideo(data);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    void handleGetVideo();
  }, []);

  if (!video) return null;

  const videoList = [video.url_1, video.url_2, video.url_3, video.url_4];

  return (
    <div className="container mx-auto py-12 px-4">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={24}
        slidesPerView={1.3}
        navigation={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          640: { slidesPerView: 2.3 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-12 overflow-visible!"
      >
        {videoList.map((url, index) => (
          <SwiperSlide key={index}>
            <VideoSlide url={url} />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #f87171 !important;
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
        }
        .swiper-pagination-bullet-active {
          background: #f87171 !important;
        }
      `}</style>
    </div>
  );
};

export default VideoReview;
