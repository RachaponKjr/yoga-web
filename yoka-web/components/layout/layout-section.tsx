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
    <div className="flex flex-col gap-6 mt-22">
      <div className="flex flex-col items-center justify-center gap-6 w-full md:aspect-16/5 aspect-16/7 bg-neutral-50 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-10" />
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center z-0"
        />
        <div className="z-50 text-center">
          <h1 className="text-[clamp(3rem,6vw,4rem)] font-semibold shadow-lg">
            {title}
          </h1>
          <p className="text-[#333333] font-medium shadow-lg max-w-2xl text-center text-[clamp(0.5rem,6vw,1rem)]">
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
