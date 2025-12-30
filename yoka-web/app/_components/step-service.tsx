import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import yoga from "@/assets/images/yoga/girlyoga.png";
import Image from "next/image";
import Link from "next/link";

const StepService = () => {
  const features = [
    {
      icon: "mdi:meditation",
      title: "Mindfulness",
      desc: "Practice living in the moment to reduce stress.",
    },
    {
      icon: "mdi:yoga",
      title: "Flexibility",
      desc: "Improve your body's range of motion naturally.",
    },
    {
      icon: "mdi:heart-pulse",
      title: "Cardio Health",
      desc: "Boost your heart health through rhythmic yoga.",
    },
    {
      icon: "mdi:leaf",
      title: "Natural Living",
      desc: "Connect with nature and find your inner peace.",
    },
  ];

  return (
    <section className="pb-12 pt-24 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* --- Image Section (Highlights) --- */}
          <div className="w-full lg:w-1/2 relative px-4 sm:px-0">
            {/* 1. Main Image Container (Arch Shape) */}
            <div className="relative aspect-[3.5/4.5] w-full max-w-md mx-auto">
              {/* กรอบรูปทรง Arch (โค้งบน) */}
              <div className="relative w-full h-full rounded-t-[10rem] rounded-b-4xl overflow-hidden shadow-2xl shadow-[#132B28]/20 z-10 border-[6px] border-white">
                <Image
                  src={yoga}
                  alt="Yoga Practice"
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
                    <Icon icon="mdi:account-group" width={24} />
                  </div>
                  <span className="text-2xl font-bold text-[#132B28]">
                    500+
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Happy Members joined with us
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
                    <text className="text-[11px] uppercase font-bold tracking-widest fill-[#3D552F]">
                      <textPath href="#curve">
                        • Yoga Studio • Balance Life
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
                  Why Choose Us
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-[#132B28] leading-[1.15]">
                Bring Balance to your <br />
                <span className="relative inline-block">
                  <span className="relative z-10">Mind & Body.</span>
                  {/* ขีดเส้นใต้แบบปากกาไฮไลท์ */}
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-200/60 -z-0 -rotate-1 rounded-full"></span>
                </span>
              </h2>
              <p className="text-lg text-[#5C6155] leading-relaxed max-w-xl">
                Experience the ultimate relaxation and rejuvenation. Our expert
                instructors guide you through a journey of self-discovery and
                physical wellness.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 py-4">
              {features.map((item, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="shrink-0 relative">
                    {/* Background icon แบบเก๋ๆ */}
                    <div className="w-16 h-16 rounded-xl bg-[#3D552F]/5 flex items-center justify-center text-[#3D552F] group-hover:bg-[#3D552F] group-hover:text-white transition-all duration-300 group-hover:rotate-6 shadow-sm">
                      <Icon icon={item.icon} width={42} height={42} />
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

            <div className="pt-4">
              <Button
                asChild
                size={"lg"}
                className="rounded-full bg-[#132B28] hover:bg-[#3D552F] text-white px-10 h-14 text-base shadow-xl shadow-[#132B28]/20 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <Link href="/booking" className="flex items-center gap-3">
                  Start Your Journey
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
