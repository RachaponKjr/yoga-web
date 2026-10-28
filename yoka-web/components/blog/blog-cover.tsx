/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Leaf } from "lucide-react";

export default function BlogCover({ src, title, priority = false }: { src?: string; title: string; priority?: boolean }) {
  const [failedSource, setFailedSource] = useState<string>();
  return <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#e9ecdf]">
    {src && src !== failedSource ? <img src={src} alt={title} loading={priority ? "eager" : "lazy"} onError={() => setFailedSource(src)} className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" /> : <><div className="absolute h-64 w-64 rounded-full border border-[#c6d0b6]" /><div className="absolute h-44 w-44 rounded-full border border-[#c6d0b6]" /><Leaf size={54} strokeWidth={1} className="text-[#7b8d68]" /><span className="absolute bottom-6 text-[10px] tracking-[0.3em] text-[#657651]">YOGA BY NITI · JOURNAL</span></>}
  </div>;
}
