"use client";
import salad from "@/assets/images/food/salad.jpg";
import salad2 from "@/assets/images/food/coffe.jpg";
import salad3 from "@/assets/images/food/food1.jpg";
import salad4 from "@/assets/images/food/salad2.jpg";
import Image from "next/image";
import { Icon } from "@iconify/react"; // เพิ่ม Icon

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "@/app/globals.css"; // (Optional) เผื่อ custom css ของ pagination

const SlideFood = () => {
  // เปลี่ยนข้อมูลเป็น Object เพื่อใส่ชื่อและราคา
  const items = [
    { src: salad, title: "Fresh Garden Salad", price: "250 THB", rating: 4.8 },
    { src: salad2, title: "Morning Coffee", price: "120 THB", rating: 4.9 },
    { src: salad3, title: "Healthy Bowl", price: "320 THB", rating: 4.7 },
    {
      src: salad4,
      title: "Mixed Veggie Special",
      price: "280 THB",
      rating: 4.6,
    },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto relative">
        {/* Decorative Ring (วงกลมตกแต่งด้านหลัง) */}
        <div className="absolute inset-0 border-2 border-primary/20 rounded-[3rem] rotate-6 scale-95 z-0" />

        <Swiper
          grabCursor={true}
          effect={"creative"}
          speed={1000} // ช้าลงนิดนึงเพื่อความสมูท
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true, // จุด pagination ขยับได้
          }}
          // --- Highlight: Effect การเลื่อนแบบซ้อนทับสวยๆ ---
          creativeEffect={{
            prev: {
              shadow: true,
              translate: ["-20%", 0, -1],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          }}
          modules={[EffectCreative, Autoplay, Pagination]}
          className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20 z-10 aspect-[4/5]" // ปรับ aspect เป็นแนวตั้งนิดๆ (4:5) ให้ดูสวยเหมือน Magazine
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="bg-white">
              <div className="relative w-full h-full group cursor-pointer">
                {/* Image */}
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  priority={index === 0} // โหลดรูปแรกก่อน
                />

                {/* Overlay Gradient (แก้ไขจาก bg-linear-to-t) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                {/* Content Text ด้านล่าง */}
                <div className="absolute bottom-0 left-0 w-full p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-bold font-serif leading-tight mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Icon icon="mdi:star" />
                        <span className="text-white/80">
                          {item.rating} (120 reviews)
                        </span>
                      </div>
                    </div>
                    <span className="bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-white shadow-lg">
                      {item.price}
                    </span>
                  </div>

                  {/* ปุ่มที่ซ่อนอยู่ จะโผล่มาเมื่อ Hover (ใน Desktop) หรือโชว์ตลอดถ้าชอบ */}
                  <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 mt-2">
                    <p className="text-sm text-gray-300 line-clamp-2">
                      Delicious and healthy choice for your daily meal. Fresh
                      ingredients only.
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SlideFood;
