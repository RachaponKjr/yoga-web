/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { videoService } from "@/service/video.service";
import { useEffect, useState } from "react";
import { instagramUrl } from "@/lib/video-content";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

interface VideoType {
  id: string;
  url_1: string;
  url_2: string;
  url_3: string;
  url_4: string;
}

const VideoSlide = ({ url }: { url: string }) => (
  <div className="w-full rounded-3xl overflow-hidden bg-white shadow-lg">
    <iframe title="วิดีโอรีวิวจาก Instagram" src={`${url}embed/`} loading="lazy"
      allow="autoplay; encrypted-media; fullscreen" className="w-full h-[480px] border-0" />
    <a href={url} target="_blank" rel="noopener noreferrer" className="block p-3 text-center text-sm underline">ดูวิดีโอบน Instagram</a>
  </div>
);

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

  const videoList = [video.url_1, video.url_2, video.url_3, video.url_4].map((url) => instagramUrl(url || "")).filter(Boolean);
  if (!videoList.length) return null;

  return (
    <div className="container mx-auto py-12 px-4">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        slidesPerView={1.5}
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
    </div>
  );
};

export default VideoReview;
