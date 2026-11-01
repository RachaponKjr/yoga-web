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
    {loading ? <p role="status">Loading the timetable…</p> : failed ? <p role="status">Unable to load the timetable. Please try again later.</p> : src ? (
      <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full" aria-label="Open the full-size timetable">
        <Image src={src} alt="Yoga By Niti class timetable" width={1200} height={1200} onError={() => setFailed(true)} className="object-contain mx-auto w-full h-auto rounded-md border border-[#dedfd4]" />
      </a>
    ) : <p className="text-[#73766b]">The timetable image is not available yet</p>}
    <p className="text-xs text-[#7b846b] tracking-[0.2em] uppercase mt-4">Yoga by Niti &bull; Studio &amp; Online</p>
  </div>;
}
