import React from "react";
import LayoutSection from "@/components/layout/layout-section";
import Image from "next/image";

import restaurant1 from "@/assets/images/banner/calender_banner.png";
import banner from "@/assets/images/banner/banner.png";

import yoga1 from "@/assets/images/gallory/CC__2033.jpg";
import yoga2 from "@/assets/images/gallory/CC__2048.jpg";
import yoga3 from "@/assets/images/gallory/CC__2231.jpg";
import yoga4 from "@/assets/images/gallory/CC__2244.jpg";
import yoga5 from "@/assets/images/gallory/CC__2427.jpg";

const Page = () => {
  return (
    <LayoutSection image={banner.src} title="Restaurant" description="">
      {/* เพิ่ม gap ให้ห่างขึ้นเพื่อให้ดูโปร่งแม้ภาพจะใหญ่ */}
      <div className="flex flex-col gap-12 md:gap-48 px-4 md:px-6 my-12 md:my-24 overflow-hidden">
        {/* --- Section 1: Our Story (Big Overlap) --- */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 relative">
          {/* Text Content (ย่อลงเหลือ 40% เพื่อให้ที่รูปภาพเยอะขึ้น) */}
          <div className="w-full lg:w-5/12 flex flex-col gap-8 z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-12 bg-tertiary/60"></span>
                <span className="text-tertiary font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                  Since 1998
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium text-[#2A2A2A] leading-[1.1]">
                A culinary journey <br />
                <span className="italic text-tertiary">rooted in</span> history.
              </h2>
            </div>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloremque soluta recusandae est exercitationem ipsam adipisci
              nesciunt cum, expedita obcaecati?
            </p>
            <div className="flex flex-col gap-2 border-l-4 border-tertiary/30 pl-6 py-2">
              <p className="text-xl text-gray-800 italic font-serif">
                &quot;Food is not just eating energy. It&apos;s an
                experience.&quot;
              </p>
              <p className="text-sm text-gray-500">- Head Chef, Giovanni</p>
            </div>
          </div>

          {/* Image Content (ขยายเป็น 7/12 หรือเกือบ 60% ของจอ) */}
          <div className="w-full lg:w-7/12 relative">
            {/* พื้นหลังตกแต่ง (เอาออกหรือทำให้จางลงเพื่อให้รูปเด่นสุด) */}
            <div className="absolute top-0 right-0 w-[90%] h-full bg-[#F2F0E9]/20 rounded-[3rem] -z-10 transform rotate-1 backdrop-blur-3xl"></div>

            {/* เพิ่มความสูง Container เพื่อรองรับรูปใหญ่ */}
            <div className="relative w-full h-[600px] md:h-[800px] flex items-center">
              {/* Main Image (ขยายเป็น 75% และชิดขวาสุด) */}
              <div className="absolute right-0 top-0 w-[75%] aspect-3/4 shadow-2xl rounded-4xl overflow-hidden z-10">
                <Image
                  src={yoga2}
                  alt="Restaurant atmosphere"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Secondary Image (ขยายเป็น 65% และซ้อนทับให้เห็นชัดๆ) */}
              <div className="absolute left-0 bottom-10 md:bottom-20 w-[65%] aspect-4/3 shadow-2xl rounded-4xl overflow-hidden border-4 border-white z-20">
                <Image
                  src={yoga1}
                  alt="Detail dish"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Ambience (Massive Grid) --- */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          {/* Images Content (ให้พื้นที่ 2 ใน 3 ของหน้าจอเลย) */}
          <div className="w-full lg:w-8/12 order-2 lg:order-1">
            <div className="flex gap-4 md:gap-6 items-start">
              {/* Column 1 (Left - ใหญ่เต็มตา) */}
              <div className="w-1/2 flex flex-col gap-6 mt-16 md:mt-32">
                <div className="w-full aspect-2/3 relative rounded-4xl overflow-hidden shadow-xl">
                  <Image
                    src={yoga5}
                    alt="Interior detail"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Column 2 (Right - ใหญ่เต็มตา) */}
              <div className="w-1/2 flex flex-col gap-6">
                <div className="w-full aspect-square relative rounded-4xl overflow-hidden shadow-xl">
                  <Image
                    src={yoga4}
                    alt="Chef at work"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="w-full aspect-3/4 relative rounded-4xl overflow-hidden shadow-xl">
                  <Image
                    src={yoga3}
                    alt="Private dining"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content (ย่อพื้นที่ Text ลง เพื่อให้รูปใหญ่ขึ้น) */}
          <div className="w-full lg:w-6/12 flex flex-col gap-8 order-1 lg:order-2 lg:sticky lg:top-32">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-12 bg-tertiary/60"></span>
                <span className="text-tertiary font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                  Restaurant
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-[#2A2A2A] leading-[1.1]">
                Designed for <br />
                <span className="italic text-tertiary">unforgettable</span>{" "}
                moments.
              </h2>
            </div>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">
              We believe that the environment is just as important as the
              cuisine. Our space is designed to be a sanctuary.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">
              From the handcrafted furniture to the carefully curated lighting,
              every detail whispers elegance.
            </p>
          </div>
        </div>

        {/* --- Banner Item --- */}
        {/* <div className="w-full">
          <BannerItem className="bg-[#8ba888]!" />
        </div> */}
        <div className="w-full aspect-16/6 overflow-hidden rounded-2xl bg-neutral-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.80375258081!2d98.32157788483991!3d7.791349598877547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502f5295ff53db%3A0xda161d49bc788348!2sYoga%20by%20Niti!5e0!3m2!1sth!2sth!4v1769008361859!5m2!1sth!2sth"
            width="600"
            height="450"
            style={{ border: "0" }}
            loading="lazy"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </LayoutSection>
  );
};

export default Page;
