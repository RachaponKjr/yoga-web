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
    <section className=" overflow-hidden relative">
      <div className="relative top-0 left-0 w-full h-full block ">
        <svg
          id="wave"
          style={{ transform: "rotate(180deg)", transition: "0.3s" }}
          viewBox="0 0 1440 100"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
              <stop stopColor="rgba(40, 54, 24, 1)" offset="0%"></stop>
              <stop stopColor="rgba(40, 54, 24, 1)" offset="100%"></stop>
            </linearGradient>
          </defs>
          <path
            style={{ transform: "translate(0, 0px)", opacity: "1" }}
            fill="url(#sw-gradient-0)"
            d="M0,80L26.7,78.3C53.3,77,107,73,160,75C213.3,77,267,83,320,85C373.3,87,427,83,480,70C533.3,57,587,33,640,30C693.3,27,747,43,800,45C853.3,47,907,33,960,23.3C1013.3,13,1067,7,1120,5C1173.3,3,1227,7,1280,20C1333.3,33,1387,57,1440,70C1493.3,83,1547,87,1600,80C1653.3,73,1707,57,1760,43.3C1813.3,30,1867,20,1920,26.7C1973.3,33,2027,57,2080,58.3C2133.3,60,2187,40,2240,28.3C2293.3,17,2347,13,2400,11.7C2453.3,10,2507,10,2560,23.3C2613.3,37,2667,63,2720,71.7C2773.3,80,2827,70,2880,60C2933.3,50,2987,40,3040,35C3093.3,30,3147,30,3200,28.3C3253.3,27,3307,23,3360,18.3C3413.3,13,3467,7,3520,16.7C3573.3,27,3627,53,3680,61.7C3733.3,70,3787,60,3813,55L3840,50L3840,100L3813.3,100C3786.7,100,3733,100,3680,100C3626.7,100,3573,100,3520,100C3466.7,100,3413,100,3360,100C3306.7,100,3253,100,3200,100C3146.7,100,3093,100,3040,100C2986.7,100,2933,100,2880,100C2826.7,100,2773,100,2720,100C2666.7,100,2613,100,2560,100C2506.7,100,2453,100,2400,100C2346.7,100,2293,100,2240,100C2186.7,100,2133,100,2080,100C2026.7,100,1973,100,1920,100C1866.7,100,1813,100,1760,100C1706.7,100,1653,100,1600,100C1546.7,100,1493,100,1440,100C1386.7,100,1333,100,1280,100C1226.7,100,1173,100,1120,100C1066.7,100,1013,100,960,100C906.7,100,853,100,800,100C746.7,100,693,100,640,100C586.7,100,533,100,480,100C426.7,100,373,100,320,100C266.7,100,213,100,160,100C106.7,100,53,100,27,100L0,100Z"
          ></path>
        </svg>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 justify-center items-center">
          {/* --- Image Section (Highlights) --- */}
          <div className="w-full lg:w-1/3 relative px-4 sm:px-0">
            {/* 1. Main Image Container (Arch Shape) */}
            <div className="relative aspect-[3.5/4.5] w-full max-w-md mx-auto">
              {/* กรอบรูปทรง Arch (โค้งบน) */}
              <div className="relative w-full h-full rounded-t-[10rem] rounded-b-4xl overflow-hidden shadow-2xl shadow-[#132B28]/20 z-10 border-[6px] border-white">
                <Image
                  src={yoga2}
                  alt="Yoga Practice at Niti"
                  fill
                  className="object-cover object-center hover:scale-110 transition-transform duration-1000 ease-out"
                />
                {/* Gradient Overlay บางๆ ด้านล่างเพื่อให้ภาพดูมีมิติ */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* 2. Floating Card (สถิติ/ประสบการณ์) - ลอยอยู่ด้านซ้ายล่าง */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 z-20 bg-white p-5 rounded-2xl shadow-xl animate-bounce-slow max-w-[180px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                    <Icon icon="mdi:account-heart" width={24} />
                  </div>
                  <span className="text-2xl font-bold text-[#132B28]">
                    500+
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Happy Community Members
                </p>
              </div>

              {/* 3. Spinning Badge (ตราประทับ) - ลอยอยู่ขวาบน */}
              <div className="absolute -top-6 -right-6 sm:-right-8 z-20 w-24 h-24 sm:w-28 sm:h-28 bg-[#E8F5E9] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                {/* Text หมุนรอบๆ */}
                <div className="absolute inset-0 animate-spin-slow flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                    <path
                      id="curve"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="transparent"
                    />
                    {/* เปลี่ยนข้อความในวงกลม */}
                    <text className="text-[11px] uppercase font-bold tracking-widest fill-[#3D552F]">
                      <textPath href="#curve">
                        • Yoga by Niti • Eat Well •
                      </textPath>
                    </text>
                  </svg>
                </div>
                {/* Icon ตรงกลาง */}
                <Icon
                  icon="mdi:lotus"
                  className="text-[#3D552F] w-8 h-8 relative z-10"
                />
              </div>

              {/* Pattern จุดๆ ตกแต่งด้านหลัง */}
              <div className="absolute -bottom-10 -right-10 w-60 h-60 opacity-30 z-0">
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
                <div className="h-px w-8 bg-primary"></div>
                <span className="text-primary font-bold tracking-wider uppercase text-sm">
                  The Niti Philosophy
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#132B28] leading-[1.15]">
                Harmonize Your <br />
                <span className="relative inline-block">
                  <span className="relative z-10">Movement & Nutrition.</span>
                  {/* ขีดเส้นใต้แบบปากกาไฮไลท์ */}
                  <span className="absolute bottom-2 left-0 w-[40%] md:w-full h-3 bg-yellow-200/60 z-0 -rotate-1 rounded-full"></span>
                </span>
              </h2>
              <p className="text-sm md:text-lg text-[#5C6155] leading-relaxed max-w-xl">
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
                    <div className="w-16 h-16 rounded-xl bg-[#3D552F]/5 flex items-center justify-center text-[#3D552F] group-hover:bg-[#3D552F] group-hover:text-white transition-all duration-300 group-hover:rotate-6 shadow-sm">
                      <Icon icon={item.icon} width={38} height={38} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h6 className="text-lg font-bold text-[#132B28] group-hover:text-primary transition-colors">
                      {item.title}
                    </h6>
                    <p className="text-sm text-[#666666] leading-relaxed">
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
                className="rounded-full bg-[#132B28] hover:bg-[#3D552F] overflow-visible text-white px-10 h-14 text-base shadow-xl shadow-[#132B28]/20 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <Link href="/booking" className="flex items-center gap-3">
                  Book a Class
                  <div className="bg-white/20 rounded-full p-1">
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
