import Image from "next/image";
import React from "react";

const LayoutSection = ({
  children,
  title,
  image,
  description,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  image: string;
  description: string;
}>) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center gap-6 w-full md:aspect-16/5 aspect-16/7 bg-neutral-50 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-10" />
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center z-0"
        />
        <div className="z-50 text-center">
          <h1 className="text-[60px] lg:text-[120px] font-semibold text-[#2A2A2A] text-shadow-2xs font-serif">
            {title}
          </h1>
          <p className="text-[#2A2A2A] font-medium max-w-4xl text-center text-shadow-2xs font-serif text-[1rem] lg:text-[2rem]">
            {description}
          </p>
        </div>
      </div>
      <div className="container mx-auto mb-12 flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
};

export default LayoutSection;
