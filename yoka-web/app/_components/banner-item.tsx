import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import leafwing from "@/assets/images/leaf-wing.png";
import Image from "next/image";

const BannerItem = ({ className }: { className?: string }) => {
  return (
    <section className={`w-full p-6 my-24`}>
      <div
        className={`w-full aspect-16/4 rounded-4xl p-14 relative overflow-hidden ${className}`}
      >
        <div className="max-w-xl flex flex-col items-start gap-4 z-50 relative">
          <div className="w-full flex items-center justify-between">
            <span className="text-6xl text-tertiary font-semibold">
              Restaurant Detail.
            </span>
          </div>
          <p className="text-[#666666] text-lg ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
            maxime quibusdam praesentium recusandae tempora sunt, ipsa delectus
            facere modi nisi!
          </p>
          <Button
            size={"lg"}
            className="rounded-full text-white bg-[#3D552F] hover:bg-[#3D552F] cursor-pointer"
          >
            View Details <Icon icon="mdi:arrow-right" />
          </Button>
        </div>
        <Image
          src={leafwing}
          alt=""
          quality={100}
          width={800}
          height={800}
          className="absolute top-0 left-0 z-20 opacity-70 pointer-events-none"
        />
      </div>
    </section>
  );
};

export default BannerItem;
