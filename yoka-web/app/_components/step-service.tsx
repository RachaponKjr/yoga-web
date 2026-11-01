import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import yoga2 from "@/assets/images/yoga/CC2082.jpg";
import Image from "next/image";
import Link from "next/link";

const StepService = () => {
  // ปรับแก้ข้อมูล Features ให้มีเรื่องอาหารคลีน (Restaurant)
  const features = [
    {
      icon: "mdi:yoga", // คงเดิม
      title: "Expert Guidance",
      desc: "Practice with certified instructors passionate about your growth.",
    },
    {
      icon: "mdi:food-apple-outline", // เปลี่ยนไอคอนเป็นอาหาร/สุขภาพ
      title: "Wholesome Dining",
      desc: "Refuel with chef-crafted clean food after your practice.",
    },
    {
      icon: "mdi:spa-outline", // เปลี่ยนเป็น Spa/Relax
      title: "Tranquil Space",
      desc: "A peaceful sanctuary designed to calm your mind instantly.",
    },
    {
      icon: "mdi:all-inclusive", // Infinity loop สื่อถึงความยั่งยืน
      title: "Sustainable Habits",
      desc: "Build a balanced lifestyle of mindful movement and eating.",
    },
  ];

  return (
    <section className=" overflow-hidden relative bg-[#f8f7f3]">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 justify-center items-center">
          {/* --- Image Section (Highlights) --- */}
          <div className="w-full lg:w-1/3 relative px-4 sm:px-0">
            {/* 1. Main Image Container (Arch Shape) */}
            <div className="relative aspect-[3.5/4.5] w-full max-w-md mx-auto">
              {/* กรอบรูปทรง Arch (โค้งบน) */}
              <div className="relative w-full h-full rounded-t-[10rem] rounded-b-md overflow-hidden z-10 border border-[#d7dccb]">
                <Image
                  src={yoga2}
                  alt="Yoga Practice at Niti"
                  fill
                  className="object-cover object-center hover:scale-[1.025] transition-transform duration-1000 ease-out motion-reduce:transform-none"
                />
                {/* Gradient Overlay บางๆ ด้านล่างเพื่อให้ภาพดูมีมิติ */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* 2. Floating Card (สถิติ/ประสบการณ์) - ลอยอยู่ด้านซ้ายล่าง */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 z-20 bg-[#fffefa] p-5 rounded-sm border border-[#dedfd4] shadow-sm max-w-[180px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#eef0e5] p-2 rounded-full text-[#788461]">
                    <Icon icon="mdi:account-heart" width={24} />
                  </div>
                  <span className="text-2xl font-serif font-normal text-[#454d39]">
                    500+
                  </span>
                </div>
                <p className="text-xs text-[#73766b] font-normal leading-relaxed">
                  Happy Community Members
                </p>
              </div>

              {/* 3. Spinning Badge (ตราประทับ) - ลอยอยู่ขวาบน */}
              <div className="absolute -top-6 -right-6 sm:-right-8 z-20 w-24 h-24 sm:w-28 sm:h-28 bg-[#eef0e5] rounded-full flex items-center justify-center border border-[#ced5bf]">
                {/* Text หมุนรอบๆ */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                    <path
                      id="curve"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="transparent"
                    />
                    {/* เปลี่ยนข้อความในวงกลม */}
                    <text className="text-[11px] uppercase font-normal tracking-widest fill-[#737f5f]">
                      <textPath href="#curve">
                        • Yoga by Niti • Eat Well •
                      </textPath>
                    </text>
                  </svg>
                </div>
                {/* Icon ตรงกลาง */}
                <Icon
                  icon="mdi:lotus"
                  className="text-[#737f5f] w-8 h-8 relative z-10"
                />
              </div>

              {/* Pattern จุดๆ ตกแต่งด้านหลัง */}
              <div className="absolute -bottom-10 -right-10 w-60 h-60 opacity-10 z-0">
                <Icon
                  icon="mdi:dots-grid"
                  className="w-full h-full text-primary opacity-30"
                />
              </div>
            </div>
          </div>

          {/* --- Content Section --- */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#9aa786]"></div>
                <span className="text-[#737b62] font-normal tracking-[0.22em] uppercase text-[10px]">
                  The Niti Philosophy
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-serif font-normal tracking-[-0.025em] text-[#30372c] leading-[1.15]">
                Harmonize Your <br />
                <span className="relative inline-block">
                  <span className="relative z-10 italic text-[#7d8867]">
                    Movement & Nutrition.
                  </span>
                  {/* ขีดเส้นใต้แบบปากกาไฮไลท์ */}
                  <span className="absolute bottom-2 left-0 w-[40%] md:w-full h-px bg-[#bfc8ae] z-0"></span>
                </span>
              </h2>
              <p className="text-sm md:text-base text-[#73766b] leading-[1.9] max-w-xl">
                We believe true wellness comes from within. Experience the
                perfect synergy of expert-led yoga classes and a kitchen
                dedicated to serving fresh, organic clean food to fuel your
                body.
              </p>
            </div>

            {/* Grid Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 md:py-4">
              {features.map((item, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="shrink-0 relative">
                    {/* Background icon แบบเก๋ๆ */}
                    <div className="w-16 h-16 rounded-sm border border-[#dce1d0] bg-[#eff1e8] flex items-center justify-center text-[#788461] group-hover:bg-[#e5e9da] transition-colors duration-300">
                      <Icon icon={item.icon} width={38} height={38} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h6 className="text-base font-medium text-[#454d39] group-hover:text-[#737f5f] transition-colors">
                      {item.title}
                    </h6>
                    <p className="text-sm text-[#73766b] leading-[1.8]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:pt-4">
              <Button
                asChild
                size={"lg"}
                className="rounded-sm bg-[#48533b] hover:bg-[#303c26] text-[#fffef5] px-10 h-12 text-sm font-normal shadow-none"
              >
                <Link href="/booking" className="flex items-center gap-3">
                  Book a Class
                  <div className="p-1">
                    <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepService;
