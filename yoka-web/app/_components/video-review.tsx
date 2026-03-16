/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
"use client";
import { videoService } from "@/service/video.service";
import { useEffect, useState } from "react";
import { Play } from "lucide-react"; // ใช้ Icon Play จาก lucide-react

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
      setVideo(data);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    handleGetVideo();
  }, []);

  if (!video) return null;

  // สร้าง Component ย่อยเพื่อจัดการลูกเล่น
  const VideoItem = ({ url }: { url: string }) => (
    <div className="group relative w-full aspect-[12/16] rounded-2xl overflow-hidden bg-black cursor-pointer shadow-md transition-all duration-500 ">
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

      {/* 2. Overlay ทับหน้าวิดีโอ (เพื่อให้รู้ว่ากดได้) */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300 flex items-center justify-center">
        {/* ปุ่ม Play ที่จะเด่นขึ้นมาเวลา Hover */}
        <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-100 group-hover:scale-125 group-hover:bg-white/50 transition-all duration-300">
          <Play className="text-white fill-white" size={30} />
        </div>
      </div>

      {/* 3. แสงเงาด้านล่าง (Gradient) ช่วยให้ดูมีมิติ */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <VideoItem url={video.url_1} />
        <VideoItem url={video.url_2} />
        <VideoItem url={video.url_3} />
        <VideoItem url={video.url_4} />
      </div>
    </div>
  );
};

export default VideoReview;
