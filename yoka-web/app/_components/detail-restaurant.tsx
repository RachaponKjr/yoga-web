import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import SlideFood from "./slide-food";

import restaurant from "@/assets/images/CC__2438.jpg";
import Image from "next/image";

const DetailRestaurant = () => {
  return (
    <section className=" bg-[#FDFCF8] text-[#1A1A1A] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center">
          {/* Left Content: Storytelling */}
          <div className="flex-1 w-full flex flex-col gap-4 md:gap-8 relative z-10 order-2 lg:order-1">
            <div className="space-y-4">
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-xs font-medium uppercase tracking-widest">
                  Wholesome Kitchen
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-serif font-medium leading-[1.1] text-[#132B28]">
                Go Vegan, <br />
                <span className="italic text-primary/80">
                  Restaurants Clean.
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-base md:text-lg text-neutral-500 leading-relaxed font-light max-w-xl">
                Go Vegan is well known locally for its healthy, nourishing vegan
                food, friendly energy, and relaxed atmosphere. Many people come
                for yoga, stay for food or come for food and discover yoga. This
                is how the community has grown organically over the years.
                {/* <strong className="text-primary font-medium">
                  100% clean food
                </strong> */}
              </p>

              {/* Minimal Quote */}
              <blockquote className="border-l-2 border-primary/30 pl-4 italic text-neutral-400 text-sm">
                &quot;Real food doesn&apos;t have ingredients, real food is
                ingredients.&quot;
              </blockquote>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                className="rounded-full h-12 px-8 bg-[#132B28] text-white hover:bg-primary transition-all duration-300 shadow-lg shadow-[#132B28]/20"
              >
                <Link href="/restaurant">Explore Menu</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="rounded-full h-12 px-6 text-[#132B28] hover:bg-[#132B28]/5 hover:text-primary gap-2 group"
              >
                <Link href="/contact">
                  Book a Table
                  <Icon
                    icon="mdi:arrow-right"
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators (Minimal Grid) */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t max-w-sm border-neutral-200">
              <div className="flex flex-row items-center gap-2">
                <Icon
                  icon="ph:plant-light"
                  className="text-primary w-6 h-6 mb-1"
                />
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#132B28]">
                    Organic Sourced
                  </span>
                  <span className="text-xs text-neutral-400">
                    Farm to table ingredients
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Icon
                  icon="ph:heart-beat-light"
                  className="text-primary w-6 h-6 mb-1"
                />
                <span className="text-sm font-semibold text-[#132B28]">
                  Clean Eating
                </span>
                <span className="text-xs text-neutral-400">
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
              <div className="w-full h-full rounded-4xl overflow-hidden shadow-2xl shadow-stone-200  relative">
                {/* Overlay Text (Optional - e.g. Open Hours) */}
                <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#132B28] shadow-sm">
                  Open Daily 08:00 - 20:00
                </div>

                {/* The Slider Component */}
                <div className="w-full h-full relative">
                  {/* <SlideFood /> */}
                  <Image
                    src={restaurant}
                    alt=""
                    quality={100}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Decorative Leaf Icon Floating */}
              <div className="absolute -bottom-6 -left-6 bg-[#FDFCF8] p-3 z-20 rounded-full shadow-lg border border-neutral-100 hidden md:block">
                <Icon icon="ph:leaf-duotone" className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailRestaurant;
