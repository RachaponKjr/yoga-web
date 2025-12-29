import React from "react";
import LayoutSection from "@/components/layout/layout-section";
import Image from "next/image";
import BannerItem from "../_components/banner-item";

const page = () => {
  return (
    <LayoutSection title="Restaurant" description="">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-row gap-8">
          <p className="text-2xl max-w-4xl text-[#333333]">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
            soluta recusandae est exercitationem ipsam adipisci nesciunt cum,
            expedita obcaecati? Assumenda perferendis consectetur molestiae
            inventore nihil ipsam voluptatum doloribus praesentium expedita
            harum officiis, vero et repellat, recusandae necessitatibus fugiat
            similique qui error explicabo architecto! Aliquid esse ullam
            deleniti maxime officiis quibusdam vel iure adipisci ab unde, quos
            et magnam itaque quae!
          </p>
          <div>
            <div className="w-[500px] h-[500px] relative rounded-2xl overflow-hidden bg-red-400">
              <Image
                src="/images/restaurant/restaurant-1.jpg"
                alt="restaurant"
                fill
                objectFit="cover"
                className="bg-neutral-100"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-8">
          <div className="flex gap-4">
            <div className="w-[300px] h-[500px] relative rounded-2xl overflow-hidden bg-red-400">
              <Image
                src="/images/restaurant/restaurant-1.jpg"
                alt="restaurant"
                fill
                objectFit="cover"
                className="bg-neutral-100"
              />
            </div>
            <div className="w-[300px] h-[500px] rounded-2xl overflow-hidden relative top-10 bg-red-400">
              <Image
                src="/images/restaurant/restaurant-1.jpg"
                alt="restaurant"
                fill
                objectFit="cover"
                className="bg-neutral-100"
              />
            </div>
          </div>
          <p className="text-2xl max-w-4xl text-[#333333]">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
            soluta recusandae est exercitationem ipsam adipisci nesciunt cum,
            expedita obcaecati? Assumenda perferendis consectetur molestiae
            inventore nihil ipsam voluptatum doloribus praesentium expedita
            harum officiis, vero et repellat, recusandae necessitatibus fugiat
            similique qui error explicabo architecto! Aliquid esse ullam
            deleniti maxime officiis quibusdam vel iure adipisci ab unde, quos
            et magnam itaque quae!
          </p>
        </div>
        <BannerItem className="bg-[#8ba888]!" />
      </div>
    </LayoutSection>
  );
};

export default page;
