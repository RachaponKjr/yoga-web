import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import leafwing from "@/assets/images/leaf-wing.png";
import Image from "next/image";

const BannerItem = ({ className }: { className?: string }) => {
  return (
    // ปรับ my-12 เป็น my-8 บนมือถือเพื่อให้กระชับขึ้น
    <section className={`w-full p-4 md:p-6 my-0 `}>
      <div
        // 1. aspect-auto บนมือถือ (เพื่อให้สูงตามเนื้อหา) แล้วค่อยเป็น aspect-16/4 บนจอใหญ่
        // 2. ลด padding จาก p-14 เป็น p-6 บนมือถือ
        // 3. ปรับ rounded ให้เล็กลงนิดหน่อยบนมือถือ
        className={`w-full aspect-auto md:aspect-16/6 lg:aspect-16/4 rounded-3xl md:rounded-4xl p-6 md:p-14 relative overflow-hidden flex items-center ${className}`}
      >
        <div className="max-w-xl flex flex-col items-start gap-2 md:gap-4 z-50 relative">
          <div className="w-full flex items-center justify-between">
            {/* ปรับขนาดตัวอักษร: มือถือ(3xl) -> Tablet(5xl) -> Desktop(6xl) */}
            <span className="text-3xl md:text-5xl lg:text-6xl text-tertiary font-semibold leading-tight">
              Nourish Your Body.
            </span>
          </div>

          {/* ปรับขนาดตัวอักษรเนื้อหาให้อ่านง่ายบนมือถือ */}
          <p className="text-[#666666] font-medium text-shadow-2xs text-sm md:text-lg">
            Complete your wellness routine with our nutrient-rich menu. From
            post-workout protein bowls to refreshing cold-pressed juices, every
            dish is crafted to support your health and recovery.
          </p>

          {/* ปุ่มเต็มความกว้างบนมือถือ (w-full) และขนาดปกติบนจอใหญ่ (md:w-auto) */}
          <Button
            size={"lg"}
            className="rounded-full text-white bg-[#3D552F] hover:bg-[#3D552F] cursor-pointer w-full md:w-auto mt-2 md:mt-0"
          >
            View Details <Icon icon="mdi:arrow-right" className="ml-2" />
          </Button>
        </div>

        <Image
          src={leafwing}
          alt=""
          quality={100}
          width={800}
          height={800}
          // ปรับขนาดรูปและตำแหน่ง:
          // - w-[50%] บนมือถือ เพื่อไม่ให้ใหญ่คับจอ
          // - ปรับ opacity ลงเล็กน้อยบนมือถือถ้ามันกวนสายตา
          className="absolute -top-10 -left-10 md:top-0 md:left-0 z-20 opacity-50 md:opacity-70 pointer-events-none w-[60%] md:w-[800px] h-auto"
        />
      </div>
    </section>
  );
};

export default BannerItem;
