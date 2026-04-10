"use client";
import { videoService } from "@/service/video.service";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface VideoType {
  id: string;
  url_1: string;
  url_2: string;
  url_3: string;
  url_4: string;
  url_5: string;
}

const YogaSchedule = () => {
  const [video, setVideo] = useState<VideoType>();
  const handleGetVideo = async () => {
    try {
      const data = await videoService.getAll();
      console.log(data, "data");
      setVideo(data);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    void handleGetVideo();
  }, []);
  return (
    <div className="container mx-auto px-4 flex flex-col justify-between gap-2 items-center w-full z-10">
      <div className="flex flex-col  items-center text-[#1A1A1A] justify-center gap-2 w-full">
        {/* --- ส่วนแสดงรูปภาพตารางสอน --- */}
        <div className="relative w-full max-w-full h-max group">
          <Image
            src={`https://api.yogabyniti.com/${video?.url_5}`}
            alt=""
            width={800}
            height={800}
            className="object-contain mx-auto"
          />
          {/* กรอบตกแต่งด้านหลัง (Decorative Frame) */}
          <div className="absolute -inset-3 border border-[#1A1A1A]/5 rounded-4xl -z-10" />

          <div className="w-full relative overflow-hidden rounded-4xl shadow-xl shadow-slate-200 border border-white">
            {/* Overlay บางๆ ให้ดูละมุน (Vignette Effect) */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#1A1A1A]/5 pointer-events-none" />
          </div>

          {/* ป้ายกำกับเล็กๆ มุมภาพ */}
        </div>

        {/* ข้อความเสริมด้านล่าง */}
        <p className="text-xs text-[#1A1A1A]/40 font-sans tracking-widest uppercase mt-4">
          Yoga by Niti &bull; Studio & Online
        </p>
      </div>
    </div>
  );
};

export default YogaSchedule;
