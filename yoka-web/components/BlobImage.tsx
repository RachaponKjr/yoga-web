"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// เปลี่ยน path ให้ตรงกับโปรเจกต์ของคุณ
import yogaBanner from "@/assets/images/yoga/yoga-banner.jpg";

gsap.registerPlugin(useGSAP);

export default function LiquidSmoothImage() {
  const blobRef = useRef(null);

  // นิยามรูปร่างต่างๆ ของหยดน้ำ (ใช้ 8 values เพื่อความละเอียดสูงสุด)
  const shapes = {
    start: "60% 40% 30% 70% / 60% 30% 70% 40%",
    shape1: "50% 50% 20% 80% / 25% 80% 20% 75%",
    shape2: "70% 30% 50% 50% / 30% 30% 70% 70%",
    shape3: "30% 70% 70% 30% / 50% 20% 80% 50%",
  };

  useGSAP(
    () => {
      // สร้าง Tween ที่เน้นความต่อเนื่องและนุ่มนวล
      gsap.to(blobRef.current, {
        keyframes: {
          "0%": { borderRadius: shapes.start },
          "25%": { borderRadius: shapes.shape1 },
          "50%": { borderRadius: shapes.shape2 },
          "75%": { borderRadius: shapes.shape3 },
          "100%": { borderRadius: shapes.start }, // กลับมาที่เดิมให้ Loop เนียน
        },
        // เคล็ดลับความสมูธ:
        duration: 15, // ใช้เวลานานๆ (15 วินาที) ต่อ 1 รอบ เพื่อให้การเปลี่ยนรูปค่อยเป็นค่อยไป
        repeat: -1, // วนตลอดไป
        ease: "sine.inOut", // sine.inOut คือ easing ที่ให้ความรู้สึก "ไหล" เป็นธรรมชาติที่สุด
      });
    },
    { scope: blobRef },
  );

  return (
    <div className="flex justify-center items-center py-10 relative">
      {/* Optional: เพิ่ม Layer แสงเงาด้านหลังเพื่อให้ดูมีมิติขึ้น (ถ้าชอบ)
         <div className="absolute w-full md:w-[30vw] aspect-square bg-primary/10 blur-2xl rounded-full animate-pulse transform scale-110 -z-10"></div>
      */}

      <div
        ref={blobRef}
        // ตั้งค่ารูปร่างเริ่มต้น และ overflow-hidden สำคัญมาก
        style={{ borderRadius: shapes.start }}
        className="w-full md:w-[30vw] aspect-square relative overflow-hidden shadow-xl bg-primary/5"
      >
        <Image
          src={yogaBanner}
          alt="Yoga Banner"
          quality={100}
          fill
          // เพิ่ม scale นิดหน่อย (1.05) และ object-cover เพื่อให้มั่นใจว่าภาพเต็มกรอบเสมอเวลาบิด
          className="w-full h-full object-cover scale-[1.05]"
        />
      </div>
    </div>
  );
}
