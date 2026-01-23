import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import SlideFood from "./slide-food";

const DetailRestaurant = () => {
  return (
    <section className="py-0 md:py-12  md:px-0 relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-12">
        {/* --- เปลี่ยน Grid เป็น Flex --- */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-0 items-center">
          {/* Left Content: Text */}
          <div className="flex-1 w-full flex flex-col gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-primary"></div>
                <span className="text-primary font-bold tracking-wider uppercase text-sm">
                  Wholesome Kitchen
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#132B28] leading-tight">
                Nourish your body with{" "}
                <span className="text-primary">Real Food.</span>
              </h2>
            </div>

            <p className="text-sm md:text-lg text-[#5C6155] leading-relaxed font-light">
              At Yoga by Niti, we believe nutrition is the foundation of
              wellness. Our kitchen serves 100% clean food, free from MSG and
              preservatives, crafted to delight your taste buds while fueling
              your practice.
              <br />
              <br />
              From refreshing cold-pressed juices to high-protein bowls, every
              dish is designed to help you recover faster and feel energized
              throughout the day.
            </p>

            <div className="flex flex-wrap gap-4 md:pt-4">
              <Button
                asChild
                variant={"outline"}
                size="lg"
                className="rounded-full px-8 bg-primary text-white hover:bg-[#132B28] hover:text-white border-transparent"
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
            <div className="flex gap-6 md:mt-6 border-t border-[#333333]/10 pt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#132B28]/70">
                <Icon icon="mdi:leaf" className="text-primary w-5 h-5" />
                <span>100% Organic</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#132B28]/70">
                <Icon icon="mdi:no-msg" className="text-primary w-5 h-5" />
                <span>No MSG Added</span>
              </div>
            </div>
          </div>

          {/* Right Content: Slider */}
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
