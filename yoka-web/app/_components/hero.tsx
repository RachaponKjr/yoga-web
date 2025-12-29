import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import leafRight from "@/assets/images/leaf-right.png";
import Image from "next/image";

import yogaBanner from "@/assets/images/yoga/yoga-banner.jpg";

const Hero = () => {
  return (
    // bg-linear-to-b from-[#dfddc6]  to-[#18281E]
    <div className="relative mt-24">
      <div className="h-max md:h-[calc(100vh-6rem)] container mx-auto mb-24 md:mb-0 px-4 md:px-6 flex flex-col md:flex-row items-center gap-12 2xl:relative">
        <div className="max-w-2xl flex flex-col gap-8 z-50">
          <h1 className="text-[clamp(4rem,12vw,6rem)] leading-none font-bold bg-linear-to-r from-tertiary via-primary to-secondary bg-clip-text text-transparent">
            Yoga Studio & Restaurant
          </h1>
          <div className="flex flex-col gap-4">
            <span className="text-[clamp(1rem,4vw,2rem)] text-[#132B28]">
              Lorem ipsum dolor sit amet consectetur.
            </span>
            <p className="text-[#666666] text-[clamp(1rem,4vw,2rem)]">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus
              maxime quibusdam praesentium recusandae tempora sunt, ipsa
              delectus facere modi nisi!
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant={"default"}
              size={"lg"}
              className="rounded-full text-white bg-[#3D552F] hover:bg-[#3D552F] cursor-pointer"
            >
              Booking Now <Icon icon="mdi:arrow-right" />
            </Button>
            <Button
              variant={"outline"}
              size={"lg"}
              className="rounded-full bg-transparent hover:bg-tertiary/20 hover:text-tertiary cursor-pointer border-tertiary/20!"
            >
              Sign Up
            </Button>
          </div>
        </div>

        <div className="relative w-full">
          <div className="w-full md:w-[40vw] rounded-2xl aspect-square bg-primary/20 shadow-xl relative overflow-hidden">
            <Image
              src={yogaBanner}
              alt=""
              quality={100}
              fill
              className="w-full h-full object-cover"
            />
          </div>
          {/* <div className="w-[20vw] h-[20vw] ring-8 ring-secondary rounded-full bg-primary/20 overflow-hidden absolute -bottom-40 -left-50 z-50">
            <Image
              src={yogaBanner2}
              alt=""
              quality={100}
              fill
              className="w-full h-full object-cover"
            />
          </div> */}
        </div>
      </div>
      <div className="absolute md:w-[45vw] w-[80vw] aspect-square right-0 bottom-0 pointer-events-none">
        <Image
          src={leafRight}
          alt=""
          quality={100}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;
