import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import SlideFood from "./slide-food";

const DetailRestaurant = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-12">
        {/* --- เปลี่ยน Grid เป็น Flex --- */}
        {/* flex-col: มือถือเรียงลงแนวตั้ง */}
        {/* lg:flex-row: จอใหญ่เรียงแนวนอนซ้ายขวา */}
        {/* gap-12 lg:gap-16: ระยะห่างระหว่างส่วน */}
        <div className="flex flex-col lg:flex-row  items-center">
          {/* Left Content: Text */}
          {/* flex-1: ให้ขยายเต็มพื้นที่เท่าๆ กับอีกฝั่ง (50%) */}
          {/* w-full: ให้กว้างเต็ม container ในมือถือ */}
          <div className="flex-1 w-full flex flex-col gap-6 relative z-10">
            <div>
              <span className="text-tertiary font-bold tracking-wider uppercase text-sm mb-2 block">
                Healthy & Fresh
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#132B28] leading-tight">
                Experience the taste of{" "}
                <span className="text-primary">Nature.</span>
              </h2>
            </div>

            <p className="text-lg text-[#5C6155] leading-relaxed font-light">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
              quas, deleniti nesciunt est ullam ratione quibusdam voluptates
              architecto veniam assumenda quam nihil animi.
              <br />
              <br />
              Culpa expedita alias reiciendis, laboriosam assumenda, vitae quasi
              unde nam illum perspiciatis.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                asChild
                variant={"outline"}
                size="lg"
                className="rounded-full px-8"
              >
                <Link href="/restaurant">Explore Menu</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-[#132B28]/20 hover:bg-[#132B28]/5 text-[#132B28]"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <Icon icon="mdi:phone" className="w-4 h-4" />
                  Book a Table
                </Link>
              </Button>
            </div>

            {/* Features / Icons */}
            <div className="flex gap-6 mt-6 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2 text-sm font-medium text-[#132B28]/70">
                <Icon icon="mdi:leaf" className="text-primary w-5 h-5" />
                <span>Organic Ingredients</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#132B28]/70">
                <Icon icon="mdi:pot-steam" className="text-primary w-5 h-5" />
                <span>Freshly Cooked</span>
              </div>
            </div>
          </div>

          {/* Right Content: Slider */}
          {/* flex-1: ขยายเต็มพื้นที่อีก 50% */}
          <div className="flex-1 w-full h-full min-h-[500px] relative">
            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden ">
              <SlideFood />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailRestaurant;
