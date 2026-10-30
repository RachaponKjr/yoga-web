"use client";
import { videoService } from "@/service/video.service";
import { scheduleImageUrl } from "@/lib/video-content";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function YogaSchedule() {
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    videoService.getAll().then((data) => {
      if (active) setSrc(scheduleImageUrl(data?.url_5));
    }).catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <div className="container mx-auto px-4 flex flex-col gap-4 items-center w-full">
    {loading ? <p role="status">กำลังโหลดตารางเรียน…</p> : failed ? <p role="status">ไม่สามารถโหลดตารางเรียนได้ กรุณาลองใหม่ภายหลัง</p> : src ? (
      <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full" aria-label="เปิดภาพตารางเรียนขนาดเต็ม">
        <Image src={src} alt="ตารางเรียนโยคะ Yoga by Niti" width={1200} height={1200} onError={() => setFailed(true)} className="object-contain mx-auto w-full h-auto" />
      </a>
    ) : <p className="text-gray-500">ยังไม่มีภาพตารางเรียน</p>}
    <p className="text-xs text-[#1A1A1A]/40 tracking-widest uppercase mt-4">Yoga by Niti &bull; Studio &amp; Online</p>
  </div>;
}
