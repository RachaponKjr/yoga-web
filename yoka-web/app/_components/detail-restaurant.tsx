import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

import restaurant from "@/assets/images/CC__2438.jpg";
import Image from "next/image";

const DetailRestaurant = () => {
  return (
    <section className=" text-[#30372c] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center">
          {/* Left Content: Storytelling */}
          <div className="flex-1 w-full flex flex-col gap-4 md:gap-8 relative z-10 order-2 lg:order-1">
            <div className="space-y-4">
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-3 py-1 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8c9778]" />
                <span className="text-[#737b62] text-[10px] font-normal uppercase tracking-[0.22em]">
                  Wholesome Kitchen
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-serif font-normal tracking-[-0.025em] leading-[1.1] text-[#30372c]">
                Go Vegan, <br />
                <span className="italic text-[#7d8867]">
                  Restaurants Clean.
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-sm md:text-base text-[#73766b] leading-[1.9] font-normal max-w-xl">
                Go Vegan is well known locally for its healthy, nourishing vegan
                food, friendly energy, and relaxed atmosphere. Many people come
                for yoga, stay for food or come for food and discover yoga. This
                is how the community has grown organically over the years.
                {/* <strong className="text-primary font-medium">
                  100% clean food
                </strong> */}
              </p>

              {/* Minimal Quote */}
              <blockquote className="border-l border-[#a4af90] pl-4 italic text-[#858d76] text-sm">
                &quot;Real food doesn&apos;t have ingredients, real food is
                ingredients.&quot;
              </blockquote>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                className="rounded-sm h-12 px-8 bg-[#48533b] font-normal text-[#fffef5] hover:bg-[#303c26] shadow-none"
              >
                <Link href="/contact">Contact Us.</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="rounded-sm h-12 px-6 font-normal text-[#30372c] hover:bg-[#eeefe6] hover:text-[#48533b] gap-2 group"
              >
                <Link href="/about">
                  View More
                  <Icon
                    icon="mdi:arrow-right"
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform motion-reduce:transform-none"
                  />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators (Minimal Grid) */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t max-w-sm border-[#dedfd4]">
              <div className="flex flex-row items-center gap-2">
                <Icon
                  icon="ph:plant-light"
                  className="text-[#7d8867] w-6 h-6 mb-1"
                />
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-[#30372c]">
                    Organic Sourced
                  </span>
                  <span className="text-[11px] text-[#7f8575]">
                    Farm to table ingredients
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Icon
                  icon="ph:heart-beat-light"
                  className="text-[#7d8867] w-6 h-6 mb-1"
                />
                <span className="text-xs font-medium text-[#30372c]">
                  Clean Eating
                </span>
                <span className="text-[11px] text-[#7f8575]">
                  No MSG & Preservatives
                </span>
              </div>
            </div>
          </div>

          {/* Right Content: Framed Slider */}
          <div className="flex-1 w-full relative order-1 lg:order-2">
            {/* Artistic Frame Effect */}
            <div className="relative mx-auto w-full aspect-4/3 max-w-full">
              {/* Main Image Container */}
              <div className="w-full h-full rounded-lg overflow-hidden border border-[#dedfd4]  relative">
                {/* Overlay Text (Optional - e.g. Open Hours) */}
                <div className="absolute top-4 right-4 z-20 bg-[#faf9f2]/95 backdrop-blur-sm px-3 py-2 rounded-sm text-[10px] font-normal text-[#30372c] shadow-sm">
                  Open Daily 09:00 - 21:00
                </div>

                {/* The Slider Component */}
                <div className="w-full h-full relative">
                  {/* <SlideFood /> */}
                  <Image
                    src={restaurant}
                    alt="Go Vegan restaurant at Yoga By Niti"
                    quality={100}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Decorative Leaf Icon Floating */}
              <div className="absolute -bottom-6 -left-6 bg-[#f8f7f3] p-3 z-20 rounded-full border border-[#dedfd4] hidden md:block">
                <Icon icon="ph:leaf-duotone" className="w-8 h-8 text-[#7d8867]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailRestaurant;
