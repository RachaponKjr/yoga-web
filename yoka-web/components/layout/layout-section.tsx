import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils"; // ถ้ามี util นี้ หรือลบออกถ้าไม่มี

const LayoutSection = ({
  children,
  title,
  image,
  description,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  image: string;
  description: string;
}>) => {
  return (
    <div className="flex flex-col w-full">
      {/* --- Banner Section --- */}
      {/* ใช้ h-[50vh] หรือ h-[60vh] เพื่อให้ภาพดูเต็มตาและ Modern ขึ้น */}
      <div className="relative w-full h-[20vh] md:h-[60vh] min-h-[400px] rounded-b-[2.5rem] md:rounded-b-[4rem] overflow-hidden shadow-xl shadow-[#132B28]/5">
        {/* Background Image with slight Zoom effect */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover object-center scale-105"
          />
        </div>

        {/* Gradient Overlay: ไล่สีจากเข้มด้านล่างขึ้นบน เพื่อให้อ่าน Text ง่าย */}
        <div className="absolute inset-0 bg-linear-to-t from-[#132B28]/90 via-[#132B28]/40 to-transparent z-10" />

        {/* Text Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="flex flex-col gap-4 max-w-4xl animate-in fade-in zoom-in duration-700">
            {/* Decorative Line */}
            <div className="w-16 h-1 bg-white/30 mx-auto rounded-full mb-2 backdrop-blur-sm" />

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-none drop-shadow-sm">
              {title}
            </h1>

            <p className="text-white/90 font-medium text-lg md:text-2xl font-light font-sans max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* --- Page Content --- */}
      {/* ดัน Content ขึ้นไปทับ Banner นิดหน่อย (-mt) เพื่อความต่อเนื่อง หรือปล่อยปกติก็ได้ */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-20 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
        {children}
      </div>
    </div>
  );
};

export default LayoutSection;
